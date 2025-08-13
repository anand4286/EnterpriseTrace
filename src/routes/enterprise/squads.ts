import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthenticatedRequest, requirePermission } from '../../middleware/auth';
import { validateRequest, validationSchemas } from '../../middleware/validation';
import { auditLogger } from '../../middleware/audit';
import { Squad, User } from '../../models';
import { users } from './auth';
import { SquadRepository, OrganizationRepository } from '../../database/repositories';
import Joi from 'joi';

const router = Router();

// Initialize database repository
const squadRepository = new SquadRepository();

// Validation schemas
const createSquadSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    purpose: Joi.string().max(500).required(),
    tribeId: validationSchemas.uuid.optional(),
    type: Joi.string().valid('feature', 'platform', 'enabling', 'complicated-subsystem').required(),
    totalPoints: Joi.number().integer().min(1).max(100).optional().default(10)
  })
};

const updateSquadSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    purpose: Joi.string().max(500).optional(),
    type: Joi.string().valid('feature', 'platform', 'enabling', 'complicated-subsystem').optional(),
    status: Joi.string().valid('forming', 'storming', 'norming', 'performing', 'dissolved').optional()
  })
};

const addMemberSchema = {
  body: Joi.object({
    userId: validationSchemas.uuid,
    role: Joi.string().valid('product-owner', 'scrum-master', 'tech-lead', 'engineer', 'designer', 'analyst', 'tester').required(),
    allocation: Joi.number().min(0).max(100).required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref('startDate')).optional()
  })
};

/**
 * @swagger
 * /api/squads:
 *   get:
 *     summary: Get squads
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: tribeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of squads
 */
router.get('/',
  authenticateToken,
  requirePermission('squads', 'read'),
  auditLogger('GET_SQUADS', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { limit = 20, offset = 0, tribeId, type, status } = req.query;
      
      // Get squads from database
      const allSquads = await squadRepository.findAll(req.organizationId, 1000, 0);
      
      // Apply filters
      let filteredSquads = allSquads;

      if (tribeId) {
        filteredSquads = filteredSquads.filter(squad => squad.tribeId === tribeId);
      }

      if (type) {
        filteredSquads = filteredSquads.filter(squad => squad.type === type);
      }

      if (status) {
        filteredSquads = filteredSquads.filter(squad => squad.status === status);
      }

      const total = filteredSquads.length;
      const paginatedSquads = filteredSquads.slice(Number(offset), Number(offset) + Number(limit));

      // Enhance squads with member details
      const enhancedSquads = await Promise.all(
        paginatedSquads.map(async (squad) => {
          const members = await squadRepository.getSquadMembers(squad.id);
          
          const productOwner = members.find(m => m.role === 'product-owner');
          const techLead = members.find(m => m.role === 'tech-lead');
          const scrumMaster = members.find(m => m.role === 'scrum-master');

          return {
            ...squad,
            members,
            productOwner: productOwner ? { 
              id: productOwner.user_id, 
              name: `${productOwner.first_name} ${productOwner.last_name}`,
              email: productOwner.email 
            } : null,
            techLead: techLead ? { 
              id: techLead.user_id, 
              name: `${techLead.first_name} ${techLead.last_name}`,
              email: techLead.email 
            } : null,
            scrumMaster: scrumMaster ? { 
              id: scrumMaster.user_id, 
              name: `${scrumMaster.first_name} ${scrumMaster.last_name}`,
              email: scrumMaster.email 
            } : null,
            memberCount: members.length,
            currentVelocity: 0 // For now, since we don't have velocity data in DB yet
          };
        })
      );

      res.json({
        squads: enhancedSquads,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < total
        }
      });

    } catch (error) {
      console.error('Get squads error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/squads:
 *   post:
 *     summary: Create new squad
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               mission:
 *                 type: string
 *               tribeId:
 *                 type: string
 *               productOwnerId:
 *                 type: string
 *               engineeringLeadId:
 *                 type: string
 *               testLeadId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [feature, platform, data, mobile]
 *               capacity:
 *                 type: number
 *               location:
 *                 type: string
 *                 enum: [onsite, remote, hybrid]
 *     responses:
 *       201:
 *         description: Squad created successfully
 */
router.post('/',
  authenticateToken,
  requirePermission('squads', 'create'),
  validateRequest(createSquadSchema),
  auditLogger('CREATE_SQUAD', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      console.log('Squad creation request body:', JSON.stringify(req.body, null, 2));
      const squadData = req.body;

      // Check if organization exists, create if not (for demo purposes)
      const orgRepository = new OrganizationRepository();
      let organization = await orgRepository.findById(req.organizationId!);
      
      if (!organization) {
        console.log(`Creating missing organization with ID: ${req.organizationId}`);
        
        // Check if organization exists with demo domain but different ID
        const existingOrgByDomain = await orgRepository.findByDomain('demo.enterprise.com');
        if (existingOrgByDomain) {
          // Use the existing organization but update the JWT organizationId in the user's context
          console.log(`Found existing demo organization: ${existingOrgByDomain.id}`);
          organization = existingOrgByDomain;
          // Update the squad to use the correct organization ID
          req.organizationId = existingOrgByDomain.id;
        } else {
          // Create new organization with the JWT's organization ID
          organization = await orgRepository.create({
            id: req.organizationId!,
            name: 'Demo Enterprise Corp',
            domain: 'demo.enterprise.com',
            subscription: {
              type: 'enterprise',
              maxUsers: 1000,
              maxProjects: 500,
              features: ['basic', 'advanced', 'premium'],
              billingCycle: 'monthly',
              price: 299
            },
            settings: {
              timezone: 'UTC',
              currency: 'USD',
              workingDays: [1, 2, 3, 4, 5], // Monday to Friday as numbers
              notifications: {
                email: true,
                slack: false,
                teams: false,
                inApp: true,
                frequency: 'daily' as const
              },
              integrations: {
                jira: null,
                github: null,
                slack: null,
                teams: null,
                confluence: null
              }
            }
          });
        }
        console.log('Demo organization resolved successfully');
      }

      const newSquad = {
        id: uuidv4(),
        organizationId: req.organizationId!,
        tribeId: squadData.tribeId,
        name: squadData.name,
        purpose: squadData.purpose,
        type: squadData.type,
        members: [], // Empty initially, will be managed separately in squad_members table
        capacity: {
          totalPoints: squadData.totalPoints || 10,
          availablePoints: squadData.totalPoints || 10,
          committedPoints: 0,
          velocity: [],
          efficiency: 0
        },
        performance: {
          deliveryRate: 0,
          qualityScore: 0,
          satisfactionScore: 0,
          lastUpdated: new Date()
        },
        status: 'forming' as const
      };

      // Save to database using the overridden create method
      const createdSquad = await squadRepository.create(newSquad);

      res.status(201).json({
        message: 'Squad created successfully',
        squad: createdSquad
      });

    } catch (error) {
      console.error('Create squad error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/squads/{squadId}:
 *   get:
 *     summary: Get squad by ID
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: squadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Squad details
 */
router.get('/:squadId',
  authenticateToken,
  requirePermission('squads', 'read'),
  auditLogger('GET_SQUAD', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { squadId } = req.params;

      const squad = await squadRepository.findById(squadId);
      if (!squad || squad.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'Squad not found' });
        return;
      }

      // Get squad members from database
      const members = await squadRepository.getSquadMembers(squadId);

      res.json({
        ...squad,
        members
      });

    } catch (error) {
      console.error('Get squad error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/squads/{squadId}:
 *   put:
 *     summary: Update squad
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: squadId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Squad updated successfully
 */
router.put('/:squadId',
  authenticateToken,
  requirePermission('squads', 'update'),
  validateRequest(updateSquadSchema),
  auditLogger('UPDATE_SQUAD', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { squadId } = req.params;
      const updates = req.body;

      // First check if squad exists and belongs to user's organization
      const existingSquad = await squadRepository.findById(squadId);
      if (!existingSquad || existingSquad.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'Squad not found' });
        return;
      }

      // Update the squad
      const updatedSquad = await squadRepository.update(squadId, {
        ...updates,
        updatedAt: new Date()
      });

      if (!updatedSquad) {
        res.status(500).json({ error: 'Failed to update squad' });
        return;
      }

      res.json({
        message: 'Squad updated successfully',
        squad: updatedSquad
      });

    } catch (error) {
      console.error('Update squad error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/squads/{squadId}/members:
 *   post:
 *     summary: Add member to squad
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: squadId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               role:
 *                 type: string
 *               allocation:
 *                 type: number
 *     responses:
 *       200:
 *         description: Member added successfully
 */
router.post('/:squadId/members',
  authenticateToken,
  requirePermission('squads', 'update'),
  validateRequest(addMemberSchema),
  auditLogger('ADD_SQUAD_MEMBER', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { squadId } = req.params;
      const { userId, role, allocation = 100, startDate, endDate } = req.body;

      // Check if squad exists and belongs to user's organization
      const squad = await squadRepository.findById(squadId);
      if (!squad || squad.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'Squad not found' });
        return;
      }

      // Add member to squad
      const member = await squadRepository.addMember(squadId, userId, role, allocation);
      
      res.status(201).json({
        message: 'Member added to squad successfully',
        member
      });

    } catch (error: any) {
      console.error('Add squad member error:', error);
      if (error.code === '23505') { // Unique constraint violation
        res.status(400).json({ error: 'User is already a member of this squad' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

/**
 * @swagger
 * /api/squads/{squadId}/members/{userId}:
 *   delete:
 *     summary: Remove member from squad
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: squadId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 */
router.delete('/:squadId/members/:userId',
  authenticateToken,
  requirePermission('squads', 'update'),
  auditLogger('REMOVE_SQUAD_MEMBER', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { squadId, userId } = req.params;

      // Check if squad exists and belongs to user's organization
      const squad = await squadRepository.findById(squadId);
      if (!squad || squad.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'Squad not found' });
        return;
      }

      // Remove member from squad
      const removed = await squadRepository.removeMember(squadId, userId);
      
      if (!removed) {
        res.status(404).json({ error: 'Member not found in squad' });
        return;
      }

      res.json({
        message: 'Member removed from squad successfully'
      });

    } catch (error) {
      console.error('Remove squad member error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/squads/{squadId}:
 *   delete:
 *     summary: Delete a squad
 *     tags: [Squads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: squadId
 *         required: true
 *         schema:
 *           type: string
 *         description: Squad ID
 *     responses:
 *       200:
 *         description: Squad deleted successfully
 *       404:
 *         description: Squad not found
 *       403:
 *         description: Insufficient permissions
 */
router.delete('/:squadId',
  authenticateToken,
  requirePermission('squads', 'delete'),
  auditLogger('DELETE_SQUAD', 'SQUAD'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { squadId } = req.params;

      console.log(`Delete squad request for ID: ${squadId}`);

      // Check if squad exists and belongs to user's organization
      const squad = await squadRepository.findById(squadId);
      if (!squad || squad.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'Squad not found' });
        return;
      }

      // Delete the squad
      await squadRepository.delete(squadId);

      console.log(`Squad deleted successfully: ${squadId}`);

      res.json({
        message: 'Squad deleted successfully',
        squadId
      });

    } catch (error) {
      console.error('Delete squad error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { router as squadRoutes };

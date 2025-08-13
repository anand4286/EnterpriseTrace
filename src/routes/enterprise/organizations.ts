import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthenticatedRequest, requireRoleLevel } from '../../middleware/auth';
import { validateRequest, validationSchemas } from '../../middleware/validation';
import { auditLogger } from '../../middleware/audit';
import { Organization, User } from '../../models';
import { organizations, users } from './auth';
import Joi from 'joi';

const router = Router();

// Validation schemas
const updateOrganizationSchema = {
  body: Joi.object({
    name: validationSchemas.organizationName.optional(),
    settings: Joi.object({
      timezone: Joi.string().optional(),
      currency: Joi.string().length(3).optional(),
      workingDays: Joi.array().items(Joi.number().min(0).max(6)).optional(),
      notifications: Joi.object({
        email: Joi.boolean().optional(),
        slack: Joi.boolean().optional(),
        teams: Joi.boolean().optional(),
        inApp: Joi.boolean().optional(),
        frequency: Joi.string().valid('real-time', 'daily', 'weekly').optional()
      }).optional(),
      integrations: Joi.object().optional()
    }).optional()
  })
};

const inviteUserSchema = {
  body: Joi.object({
    email: validationSchemas.email,
    firstName: validationSchemas.userName,
    lastName: validationSchemas.userName,
    role: Joi.string().required(),
    department: Joi.string().optional(),
    jobTitle: Joi.string().optional()
  })
};

/**
 * @swagger
 * /api/organizations/current:
 *   get:
 *     summary: Get current organization details
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Organization'
 */
router.get('/current',
  authenticateToken,
  auditLogger('GET_ORGANIZATION', 'ORGANIZATION'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const organization = organizations.find(org => org.id === req.organizationId);
      
      if (!organization) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      res.json(organization);
    } catch (error) {
      console.error('Get organization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/organizations/current:
 *   put:
 *     summary: Update current organization
 *     tags: [Organizations]
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
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Organization updated successfully
 */
router.put('/current',
  authenticateToken,
  requireRoleLevel(['executive', 'manager']),
  validateRequest(updateOrganizationSchema),
  auditLogger('UPDATE_ORGANIZATION', 'ORGANIZATION'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const organizationIndex = organizations.findIndex(org => org.id === req.organizationId);
      
      if (organizationIndex === -1) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      const updates = req.body;
      const organization = organizations[organizationIndex];

      // Update organization
      if (updates.name) {
        organization.name = updates.name;
      }

      if (updates.settings) {
        organization.settings = {
          ...organization.settings,
          ...updates.settings
        };
      }

      organization.updatedAt = new Date();

      res.json({
        message: 'Organization updated successfully',
        organization
      });

    } catch (error) {
      console.error('Update organization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/organizations/users:
 *   get:
 *     summary: Get organization users
 *     tags: [Organizations]
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, pending]
 *     responses:
 *       200:
 *         description: Organization users
 */
router.get('/users',
  authenticateToken,
  auditLogger('GET_ORGANIZATION_USERS', 'USER'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { limit = 20, offset = 0, search, role, status } = req.query;
      
      let organizationUsers = users.filter(user => user.organizationId === req.organizationId);

      // Apply filters
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        organizationUsers = organizationUsers.filter(user =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }

      if (role) {
        organizationUsers = organizationUsers.filter(user => user.role.name === role);
      }

      if (status) {
        organizationUsers = organizationUsers.filter(user => user.status === status);
      }

      const total = organizationUsers.length;
      const paginatedUsers = organizationUsers
        .slice(Number(offset), Number(offset) + Number(limit))
        .map(user => ({
          ...user,
          profile: {
            ...user.profile,
            hashedPassword: undefined // Don't expose passwords
          }
        }));

      res.json({
        users: paginatedUsers,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          hasMore: Number(offset) + Number(limit) < total
        }
      });

    } catch (error) {
      console.error('Get organization users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/organizations/invite:
 *   post:
 *     summary: Invite user to organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               department:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: User invited successfully
 */
router.post('/invite',
  authenticateToken,
  requireRoleLevel(['executive', 'manager']),
  validateRequest(inviteUserSchema),
  auditLogger('INVITE_USER', 'USER'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { email, firstName, lastName, role, department, jobTitle } = req.body;

      // Check if user already exists
      if (users.find(user => user.email.toLowerCase() === email.toLowerCase())) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      // Generate invite token (simplified - in real app, store in database with expiration)
      const inviteToken = Buffer.from(`${req.organizationId}:${role}`).toString('base64');

      // In real implementation, send email with invite link
      console.log(`Invite sent to ${email}: ${process.env.APP_URL || 'http://localhost:3000'}/register?token=${inviteToken}`);

      res.json({
        message: 'User invited successfully',
        inviteToken, // For demo purposes - don't return in production
        inviteLink: `${process.env.APP_URL || 'http://localhost:3000'}/register?token=${inviteToken}`
      });

    } catch (error) {
      console.error('Invite user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/organizations/users/{userId}:
 *   put:
 *     summary: Update user in organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               role:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *               profile:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/users/:userId',
  authenticateToken,
  requireRoleLevel(['executive', 'manager']),
  auditLogger('UPDATE_USER', 'USER'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const userIndex = users.findIndex(user => 
        user.id === userId && user.organizationId === req.organizationId
      );

      if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const user = users[userIndex];

      // Update user
      if (updates.role) {
        user.role = updates.role;
      }

      if (updates.status) {
        user.status = updates.status;
      }

      if (updates.profile) {
        user.profile = {
          ...user.profile,
          ...updates.profile
        };
      }

      user.updatedAt = new Date();

      res.json({
        message: 'User updated successfully',
        user: {
          ...user,
          profile: {
            ...user.profile,
            hashedPassword: undefined
          }
        }
      });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/organizations/users/{userId}:
 *   delete:
 *     summary: Remove user from organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed successfully
 */
router.delete('/users/:userId',
  authenticateToken,
  requireRoleLevel(['executive']),
  auditLogger('REMOVE_USER', 'USER'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { userId } = req.params;

      const userIndex = users.findIndex(user => 
        user.id === userId && user.organizationId === req.organizationId
      );

      if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Prevent removing yourself
      if (userId === req.user?.id) {
        res.status(400).json({ error: 'Cannot remove yourself' });
        return;
      }

      users.splice(userIndex, 1);

      res.json({ message: 'User removed successfully' });

    } catch (error) {
      console.error('Remove user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/organizations/stats:
 *   get:
 *     summary: Get organization statistics
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization statistics
 */
router.get('/stats',
  authenticateToken,
  auditLogger('GET_ORGANIZATION_STATS', 'ORGANIZATION'),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const organizationUsers = users.filter(user => user.organizationId === req.organizationId);
      
      const stats = {
        totalUsers: organizationUsers.length,
        activeUsers: organizationUsers.filter(u => u.status === 'active').length,
        inactiveUsers: organizationUsers.filter(u => u.status === 'inactive').length,
        pendingUsers: organizationUsers.filter(u => u.status === 'pending').length,
        usersByRole: organizationUsers.reduce((acc, user) => {
          const roleName = user.role.name;
          acc[roleName] = (acc[roleName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        usersByDepartment: organizationUsers.reduce((acc, user) => {
          const dept = user.profile.department || 'Unassigned';
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      res.json(stats);

    } catch (error) {
      console.error('Get organization stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { router as organizationRoutes };

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { authenticateToken, AuthenticatedRequest, requirePermission } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validation';
import { auditLogger } from '../../middleware/audit';
import { User, UserRole } from '../../models';
import { RepositoryFactory } from '../../database/repositories';
import Joi from 'joi';

const router = Router();

// In-memory roles (will be moved to database in future)
let systemRoles: UserRole[] = [];

// Initialize default roles
const initializeDefaultRoles = () => {
  if (systemRoles.length === 0) {
    const defaultRoles: UserRole[] = [
      {
        id: 'admin-role',
        name: 'ADMIN',
        level: 'executive',
        permissions: ['*']
      },
      {
        id: 'manager-role',
        name: 'MANAGER',
        level: 'manager',
        permissions: ['squads:*', 'users:read', 'users:update', 'projects:*', 'reports:*']
      },
      {
        id: 'lead-role',
        name: 'LEAD',
        level: 'lead',
        permissions: ['squads:read', 'squads:update', 'projects:read', 'projects:update']
      },
      {
        id: 'member-role',
        name: 'MEMBER',
        level: 'member',
        permissions: ['squads:read', 'projects:read']
      },
      {
        id: 'viewer-role',
        name: 'VIEWER',
        level: 'viewer',
        permissions: ['squads:read', 'projects:read', 'reports:read']
      }
    ];
    
    systemRoles.push(...defaultRoles);
    console.log('Default roles initialized:', systemRoles.length);
  }
};

// Call initialization
initializeDefaultRoles();

// Validation schemas
const createUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    roleId: Joi.string().required(),
    profile: Joi.object({
      department: Joi.string().required(),
      jobTitle: Joi.string().required(),
      location: Joi.string().required(),
      phone: Joi.string().optional(),
      skills: Joi.array().items(Joi.string()).default([])
    }).required(),
    status: Joi.string().valid('active', 'inactive', 'pending').default('pending'),
    password: Joi.string().min(8).optional() // Optional for inviting users
  })
};

const updateUserSchema = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    roleId: Joi.string().optional(),
    profile: Joi.object({
      department: Joi.string().optional(),
      jobTitle: Joi.string().optional(),
      location: Joi.string().optional(),
      phone: Joi.string().optional(),
      skills: Joi.array().items(Joi.string()).optional()
    }).optional(),
    status: Joi.string().valid('active', 'inactive', 'pending').optional()
  })
};

const createRoleSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    level: Joi.string().valid('executive', 'manager', 'lead', 'member', 'viewer').required(),
    permissions: Joi.array().items(Joi.string()).required(),
    description: Joi.string().optional()
  })
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users in organization
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users',
  authenticateToken,
  requirePermission('users', 'read'),
  auditLogger('GET_USERS', 'USER'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userRepository = RepositoryFactory.getUserRepository();
      const organizationUsers = await userRepository.findByOrganization(req.organizationId!);
      
      // Remove sensitive data
      const sanitizedUsers = organizationUsers.map((user: User) => ({
        ...user,
        profile: {
          ...user.profile,
          hashedPassword: undefined
        }
      }));

      res.json({
        users: sanitizedUsers,
        total: sanitizedUsers.length
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.post('/users',
  authenticateToken,
  requirePermission('users', 'create'),
  validateRequest(createUserSchema),
  auditLogger('CREATE_USER', 'USER'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email, firstName, lastName, roleId, profile, status, password } = req.body;
      const userRepository = RepositoryFactory.getUserRepository();

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email.toLowerCase());
      if (existingUser) {
        res.status(400).json({ error: 'User with this email already exists' });
        return;
      }

      // Validate role exists
      const role = systemRoles.find(r => r.id === roleId);
      if (!role) {
        res.status(400).json({ error: 'Invalid role ID' });
        return;
      }

      // Hash password if provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const newUser: User = {
        id: uuidv4(),
        email: email.toLowerCase(),
        firstName,
        lastName,
        organizationId: req.organizationId!,
        role,
        permissions: [], // Can be extended later
        profile: {
          ...profile,
          avatar: '',
          certifications: [],
          ...(hashedPassword && { hashedPassword })
        },
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const savedUser = await userRepository.create(newUser);

      // Remove sensitive data from response
      const responseUser = {
        ...savedUser,
        profile: {
          ...savedUser.profile,
          hashedPassword: undefined
        }
      };

      res.status(201).json({
        user: responseUser,
        message: password ? 'User created successfully' : 'User invited successfully'
      });

    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.put('/users/:id',
  authenticateToken,
  requirePermission('users', 'update'),
  validateRequest(updateUserSchema),
  auditLogger('UPDATE_USER', 'USER'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userRepository = RepositoryFactory.getUserRepository();

      const existingUser = await userRepository.findById(id);
      if (!existingUser || existingUser.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // If roleId is being updated, validate it
      if (updates.roleId) {
        const role = systemRoles.find(r => r.id === updates.roleId);
        if (!role) {
          res.status(400).json({ error: 'Invalid role ID' });
          return;
        }
        existingUser.role = role;
      }

      // Update user fields
      if (updates.firstName) existingUser.firstName = updates.firstName;
      if (updates.lastName) existingUser.lastName = updates.lastName;
      if (updates.status) existingUser.status = updates.status;
      if (updates.profile) {
        existingUser.profile = { ...existingUser.profile, ...updates.profile };
      }

      existingUser.updatedAt = new Date();
      const updatedUser = await userRepository.update(id, existingUser);

      if (!updatedUser) {
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }

      // Remove sensitive data from response
      const responseUser = {
        ...updatedUser,
        profile: {
          ...updatedUser.profile,
          hashedPassword: undefined
        }
      };

      res.json({
        user: responseUser,
        message: 'User updated successfully'
      });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/users/:id',
  authenticateToken,
  requirePermission('users', 'delete'),
  auditLogger('DELETE_USER', 'USER'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userRepository = RepositoryFactory.getUserRepository();

      const existingUser = await userRepository.findById(id);
      if (!existingUser || existingUser.organizationId !== req.organizationId) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Prevent self-deletion
      if (existingUser.id === req.user?.id) {
        res.status(400).json({ error: 'Cannot delete your own account' });
        return;
      }

      await userRepository.delete(id);

      res.json({ message: 'User deleted successfully' });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 */
router.get('/roles',
  authenticateToken,
  requirePermission('users', 'read'),
  auditLogger('GET_ROLES', 'ROLE'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      res.json({
        roles: systemRoles,
        total: systemRoles.length
      });
    } catch (error) {
      console.error('Get roles error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create new role
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 */
router.post('/roles',
  authenticateToken,
  requirePermission('users', 'create'),
  validateRequest(createRoleSchema),
  auditLogger('CREATE_ROLE', 'ROLE'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name, level, permissions, description } = req.body;

      // Check if role already exists
      const existingRole = systemRoles.find(r => r.name.toLowerCase() === name.toLowerCase());
      if (existingRole) {
        res.status(400).json({ error: 'Role with this name already exists' });
        return;
      }

      const newRole: UserRole = {
        id: uuidv4(),
        name: name.toUpperCase(),
        level,
        permissions
      };

      systemRoles.push(newRole);

      res.status(201).json({
        role: { ...newRole, description },
        message: 'Role created successfully'
      });

    } catch (error) {
      console.error('Create role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 */
router.put('/roles/:id',
  authenticateToken,
  requirePermission('users', 'update'),
  validateRequest(createRoleSchema),
  auditLogger('UPDATE_ROLE', 'ROLE'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, level, permissions, description } = req.body;

      const roleIndex = systemRoles.findIndex(r => r.id === id);
      if (roleIndex === -1) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }

      const updatedRole: UserRole = {
        ...systemRoles[roleIndex],
        name: name.toUpperCase(),
        level,
        permissions
      };

      systemRoles[roleIndex] = updatedRole;

      res.json({
        role: { ...updatedRole, description },
        message: 'Role updated successfully'
      });

    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete role
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/roles/:id',
  authenticateToken,
  requirePermission('users', 'delete'),
  auditLogger('DELETE_ROLE', 'ROLE'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const roleIndex = systemRoles.findIndex(r => r.id === id);
      if (roleIndex === -1) {
        res.status(404).json({ error: 'Role not found' });
        return;
      }

      // Check if any users are using this role
      const userRepository = RepositoryFactory.getUserRepository();
      const allUsers = await userRepository.findByOrganization(req.organizationId!);
      const usersWithRole = allUsers.filter((u: User) => u.role.id === id);
      if (usersWithRole.length > 0) {
        res.status(400).json({ 
          error: 'Cannot delete role that is assigned to users',
          usersCount: usersWithRole.length
        });
        return;
      }

      systemRoles.splice(roleIndex, 1);

      res.json({ message: 'Role deleted successfully' });

    } catch (error) {
      console.error('Delete role error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { router as userManagementRoutes, systemRoles };

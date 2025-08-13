import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '../../middleware/auth';
import { validateRequest, validationSchemas } from '../../middleware/validation';
import { auditLogger } from '../../middleware/audit';
import { User, Organization } from '../../models';
import Joi from 'joi';

const router = Router();

// Mock database - replace with real database in production
const users: User[] = [];
const organizations: Organization[] = [];

// Initialize demo data
async function initializeDemoData() {
  if (users.length === 0) {
    // Create demo organization
    const demoOrg: Organization = {
      id: 'be54b036-894b-4b00-b4fd-6f64b406083e',
      name: 'Demo Enterprise',
      domain: 'demo.enterprise.com',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        workingDays: [1, 2, 3, 4, 5],
        notifications: {
          email: true,
          slack: false,
          teams: false,
          inApp: true,
          frequency: 'real-time'
        },
        integrations: {
          jira: { enabled: false, config: {} },
          slack: { enabled: false, config: {} },
          github: { enabled: false, config: {} },
          teams: { enabled: false, config: {} },
          confluence: { enabled: false, config: {} }
        }
      },
      subscription: {
        type: 'enterprise',
        maxUsers: 100,
        maxProjects: 10,
        features: ['squads', 'traceability', 'testing'],
        billingCycle: 'yearly',
        price: 999
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    organizations.push(demoOrg);

    // Create demo admin user
    const hashedPassword = await bcrypt.hash('Demo123!', 10);
    const demoUser: User = {
      id: 'admin-demo-user-id',
      email: 'admin@demo.com',
      firstName: 'Admin',
      lastName: 'User',
      organizationId: demoOrg.id,
      role: {
        id: 'admin-role',
        name: 'ADMIN',
        level: 'executive',
        permissions: ['*'] // Wildcard permission for admin
      },
      permissions: [
        { resource: 'squads', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'organizations', actions: ['read', 'update', 'delete'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'tribes', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'teams', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'accounts', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'auth', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'admin', actions: ['create', 'read', 'update', 'delete'] },
        { resource: '*', actions: ['*'] } // Wildcard permission for everything
      ],
      profile: {
        avatar: '',
        location: 'Remote',
        department: 'IT',
        jobTitle: 'System Administrator',
        skills: ['Management', 'Systems'],
        certifications: [],
        hashedPassword // Store temporarily for demo
      } as any, // Type assertion to handle extra hashedPassword property
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    };
    users.push(demoUser);

    console.log('Demo authentication data initialized');
    console.log('Demo user:', demoUser.email);
    console.log('Demo organization:', demoOrg.name);
  }
}

// Initialize demo data on module load
initializeDemoData().catch(console.error);

// Validation schemas
const loginSchema = {
  body: Joi.object({
    email: validationSchemas.email,
    password: Joi.string().required()
  })
};

const registerOrganizationSchema = {
  body: Joi.object({
    organizationName: validationSchemas.organizationName,
    domain: Joi.string().domain().required(),
    adminEmail: validationSchemas.email,
    adminPassword: validationSchemas.password,
    adminFirstName: validationSchemas.userName,
    adminLastName: validationSchemas.userName,
    subscriptionType: Joi.string().valid('starter', 'professional', 'enterprise', 'custom').default('starter')
  })
};

const registerUserSchema = {
  body: Joi.object({
    email: validationSchemas.email,
    password: validationSchemas.password,
    firstName: validationSchemas.userName,
    lastName: validationSchemas.userName,
    inviteToken: Joi.string().required()
  })
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', 
  validateRequest(loginSchema),
  auditLogger('LOGIN', 'USER'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // In real implementation, compare with hashed password stored separately
      // For demo, we'll store it in profile temporarily
      const storedPassword = (user.profile as any).hashedPassword;
      if (!storedPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, storedPassword);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      if (user.status !== 'active') {
        res.status(401).json({ error: 'Account is not active' });
        return;
      }

      const token = generateToken(user);

      // Update last login
      user.lastLoginAt = new Date();

      res.json({
        token,
        user: {
          ...user,
          profile: {
            ...user.profile,
            hashedPassword: undefined // Don't send password
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/auth/register-organization:
 *   post:
 *     summary: Register new organization with admin user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationName:
 *                 type: string
 *               domain:
 *                 type: string
 *               adminEmail:
 *                 type: string
 *                 format: email
 *               adminPassword:
 *                 type: string
 *               adminFirstName:
 *                 type: string
 *               adminLastName:
 *                 type: string
 *               subscriptionType:
 *                 type: string
 *                 enum: [starter, professional, enterprise, custom]
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Organization or user already exists
 */
router.post('/register-organization',
  validateRequest(registerOrganizationSchema),
  auditLogger('REGISTER_ORGANIZATION', 'ORGANIZATION'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        organizationName,
        domain,
        adminEmail,
        adminPassword,
        adminFirstName,
        adminLastName,
        subscriptionType
      } = req.body;

      // Check if organization domain already exists
      if (organizations.find(org => org.domain === domain)) {
        res.status(409).json({ error: 'Organization domain already exists' });
        return;
      }

      // Check if admin email already exists
      if (users.find(user => user.email.toLowerCase() === adminEmail.toLowerCase())) {
        res.status(409).json({ error: 'Admin email already exists' });
        return;
      }

      const organizationId = uuidv4();
      const adminUserId = uuidv4();

      // Create organization
      const newOrganization: Organization = {
        id: organizationId,
        name: organizationName,
        domain,
        settings: {
          timezone: 'UTC',
          currency: 'USD',
          workingDays: [1, 2, 3, 4, 5],
          notifications: {
            email: true,
            slack: false,
            teams: false,
            inApp: true,
            frequency: 'real-time'
          },
          integrations: {
            jira: null,
            github: null,
            slack: null,
            teams: null,
            confluence: null
          }
        },
        subscription: {
          type: subscriptionType,
          maxUsers: subscriptionType === 'starter' ? 10 : subscriptionType === 'professional' ? 100 : 1000,
          maxProjects: subscriptionType === 'starter' ? 5 : subscriptionType === 'professional' ? 50 : 500,
          features: ['basic', ...(subscriptionType !== 'starter' ? ['advanced'] : []), ...(subscriptionType === 'enterprise' ? ['premium'] : [])],
          billingCycle: 'monthly',
          price: subscriptionType === 'starter' ? 29 : subscriptionType === 'professional' ? 99 : 299
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser: User = {
        id: adminUserId,
        organizationId,
        email: adminEmail,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: {
          id: uuidv4(),
          name: 'ADMIN',
          level: 'executive',
          permissions: ['*'] // All permissions
        },
        permissions: [
          { resource: '*', actions: ['*'] }
        ],
        profile: {
          phone: '',
          avatar: '',
          location: '',
          department: 'Administration',
          jobTitle: 'System Administrator',
          skills: ['Leadership', 'Management'],
          certifications: [],
          ...(hashedPassword && { hashedPassword }) // Store temporarily for demo
        } as any,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      organizations.push(newOrganization);
      users.push(adminUser);

      const token = generateToken(adminUser);

      res.status(201).json({
        message: 'Organization created successfully',
        token,
        organization: newOrganization,
        user: {
          ...adminUser,
          profile: {
            ...adminUser.profile,
            hashedPassword: undefined
          }
        }
      });

    } catch (error) {
      console.error('Organization registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/auth/register-user:
 *   post:
 *     summary: Register new user with invite token
 *     tags: [Authentication]
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
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               inviteToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid invite token
 *       409:
 *         description: User already exists
 */
router.post('/register-user',
  validateRequest(registerUserSchema),
  auditLogger('REGISTER_USER', 'USER'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, inviteToken } = req.body;

      // Check if user already exists
      if (users.find(user => user.email.toLowerCase() === email.toLowerCase())) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      // Validate invite token (simplified - in real app, store and validate tokens)
      const decodedInvite = Buffer.from(inviteToken, 'base64').toString();
      const [organizationId, role] = decodedInvite.split(':');

      if (!organizationId || !role) {
        res.status(400).json({ error: 'Invalid invite token' });
        return;
      }

      const organization = organizations.find(org => org.id === organizationId);
      if (!organization) {
        res.status(400).json({ error: 'Invalid invite token' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: uuidv4(),
        organizationId,
        email,
        firstName,
        lastName,
        role: {
          id: uuidv4(),
          name: role,
          level: 'member',
          permissions: ['read', 'write']
        },
        permissions: [
          { resource: 'projects', actions: ['read', 'write'] },
          { resource: 'squads', actions: ['read'] }
        ],
        profile: {
          phone: '',
          avatar: '',
          location: '',
          department: '',
          jobTitle: '',
          skills: [],
          certifications: [],
          ...(hashedPassword && { hashedPassword }) // Store temporarily for demo
        } as any,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(newUser);

      const token = generateToken(newUser);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          ...newUser,
          profile: {
            ...newUser.profile,
            hashedPassword: undefined
          }
        }
      });

    } catch (error) {
      console.error('User registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid token
 */
router.post('/refresh',
  auditLogger('REFRESH_TOKEN', 'USER'),
  (req: Request, res: Response) => {
    // Implementation would verify current token and issue new one
    res.json({ message: 'Token refresh not implemented yet' });
  }
);

export { router as authRoutes, users, organizations };

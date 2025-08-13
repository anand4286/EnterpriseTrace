import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'enterprise-tsr-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: User;
  organizationId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = decoded as User;
    req.organizationId = decoded.organizationId;
    next();
  });
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
      permissions: user.permissions
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const requirePermission = (resource: string, action: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check for admin role with wildcard permissions
    if (req.user.role.name === 'ADMIN' && Array.isArray(req.user.role.permissions) && req.user.role.permissions.includes('*')) {
      next();
      return;
    }

    const hasPermission = req.user.permissions?.some(p => 
      p.resource === resource && p.actions.includes(action)
    ) || req.user.role.name === 'SUPER_ADMIN';

    if (!hasPermission) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const requireRoleLevel = (levels: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!levels.includes(req.user.role.level) && req.user.role.name !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Insufficient role privileges' });
      return;
    }

    next();
  };
};

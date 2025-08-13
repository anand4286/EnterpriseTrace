import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from './auth';

export interface AuditLog {
  id: string;
  userId?: string;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

// In-memory store for demo - replace with database in production
const auditLogs: AuditLog[] = [];

export const auditLogger = (action: string, resource: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const originalSend = res.send;

    res.send = function(data: any) {
      const success = res.statusCode < 400;
      
      const auditLog: AuditLog = {
        id: uuidv4(),
        userId: req.user?.id,
        organizationId: req.organizationId,
        action,
        resource,
        resourceId: req.params.id,
        changes: req.method !== 'GET' ? req.body : undefined,
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        timestamp: new Date(),
        success,
        errorMessage: success ? undefined : data?.error || 'Unknown error'
      };

      auditLogs.push(auditLog);
      
      // Log to console for development
      console.log(`[AUDIT] ${action} on ${resource} by ${req.user?.email || 'anonymous'} - ${success ? 'SUCCESS' : 'FAILED'}`);
      
      return originalSend.call(this, data);
    };

    next();
  };
};

export const getAuditLogs = (filters?: {
  userId?: string;
  organizationId?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}): AuditLog[] => {
  let filtered = auditLogs;

  if (filters) {
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }
    if (filters.organizationId) {
      filtered = filtered.filter(log => log.organizationId === filters.organizationId);
    }
    if (filters.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource);
    }
    if (filters.startDate) {
      filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
    }
  }

  // Sort by timestamp descending
  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Apply pagination
  const offset = filters?.offset || 0;
  const limit = filters?.limit || 100;
  
  return filtered.slice(offset, offset + limit);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(`[${logLevel}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
  });
  
  next();
};

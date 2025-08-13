import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate path parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
      return;
    }

    next();
  };
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Token expired' });
    return;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({ 
      error: 'Validation failed',
      details: err.details || err.message
    });
    return;
  }

  // Database errors
  if (err.code === 'ECONNREFUSED') {
    res.status(503).json({ error: 'Database connection failed' });
    return;
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Common validation schemas
export const validationSchemas = {
  uuid: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),
  organizationName: Joi.string().min(2).max(100).required(),
  userName: Joi.string().min(2).max(50).required(),
  description: Joi.string().max(1000).optional(),
  pagination: {
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0)
  },
  dateRange: {
    startDate: Joi.date().optional(),
    endDate: Joi.date().greater(Joi.ref('startDate')).optional()
  }
};

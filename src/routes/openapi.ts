import { Router } from 'express';
import { OpenApiParser } from '../services/OpenApiParser';
import { ApiResponse, OpenApiSpec } from '../types';

export const openApiRouter = Router();

/**
 * @swagger
 * /api/openapi/parse:
 *   post:
 *     summary: Parse OpenAPI specification
 *     description: Parse and validate an OpenAPI specification file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spec:
 *                 type: object
 *                 description: OpenAPI specification object
 *               filePath:
 *                 type: string
 *                 description: Path to the OpenAPI spec file
 *     responses:
 *       200:
 *         description: Successfully parsed OpenAPI spec
 *       400:
 *         description: Invalid OpenAPI specification
 *       500:
 *         description: Internal server error
 */
openApiRouter.post('/parse', async (req, res) => {
  try {
    const { spec, filePath } = req.body;
    
    if (!spec && !filePath) {
      return res.status(400).json({
        success: false,
        error: 'Either spec object or filePath is required'
      } as ApiResponse);
    }

    const parser = new OpenApiParser();
    const parsedSpec = await parser.parse(spec || filePath);
    
    return res.json({
      success: true,
      data: parsedSpec,
      message: 'OpenAPI specification parsed successfully'
    } as ApiResponse<OpenApiSpec>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse OpenAPI spec'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/openapi/validate:
 *   post:
 *     summary: Validate OpenAPI specification
 *     description: Validate an OpenAPI specification against the OpenAPI 3.0 schema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spec:
 *                 type: object
 *                 description: OpenAPI specification object to validate
 *     responses:
 *       200:
 *         description: Validation results
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
openApiRouter.post('/validate', async (req, res) => {
  try {
    const { spec } = req.body;
    
    if (!spec) {
      return res.status(400).json({
        success: false,
        error: 'OpenAPI spec is required'
      } as ApiResponse);
    }

    const parser = new OpenApiParser();
    const validation = await parser.validate(spec);
    
    return res.json({
      success: validation.valid,
      data: validation,
      message: validation.valid ? 'OpenAPI spec is valid' : 'OpenAPI spec has validation errors'
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to validate OpenAPI spec'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/openapi/endpoints:
 *   post:
 *     summary: Extract endpoints from OpenAPI spec
 *     description: Extract all API endpoints with their details from an OpenAPI specification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spec:
 *                 type: object
 *                 description: OpenAPI specification object
 *     responses:
 *       200:
 *         description: Successfully extracted endpoints
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
openApiRouter.post('/endpoints', async (req, res) => {
  try {
    const { spec } = req.body;
    
    if (!spec) {
      return res.status(400).json({
        success: false,
        error: 'OpenAPI spec is required'
      } as ApiResponse);
    }

    const parser = new OpenApiParser();
    const endpoints = await parser.extractEndpoints(spec);
    
    return res.json({
      success: true,
      data: endpoints,
      message: `Successfully extracted ${endpoints.length} endpoints`
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract endpoints'
    } as ApiResponse);
  }
});

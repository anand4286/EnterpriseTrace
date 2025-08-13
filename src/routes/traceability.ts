import { Router, Request, Response } from 'express';
import { TraceabilityService } from '../services/TraceabilityService';
import { ApiResponse, TraceabilityMatrix } from '../types';

export const traceabilityRouter = Router();

/**
 * @swagger
 * /api/traceability/matrix:
 *   post:
 *     summary: Generate traceability matrix
 *     description: Generate a comprehensive traceability matrix from OpenAPI specification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: Project ID
 *               openApiSpec:
 *                 type: object
 *                 description: OpenAPI specification
 *               includeTests:
 *                 type: boolean
 *                 description: Whether to include existing test cases
 *     responses:
 *       200:
 *         description: Traceability matrix generated successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
traceabilityRouter.post('/matrix', async (req: Request, res: Response) => {
  try {
    const { projectId, openApiSpec, includeTests = true } = req.body;
    
    if (!projectId || !openApiSpec) {
      return res.status(400).json({
        success: false,
        error: 'Project ID and OpenAPI specification are required'
      } as ApiResponse);
    }

    const traceabilityService = new TraceabilityService();
    const matrix = await traceabilityService.generateMatrix(projectId, openApiSpec, includeTests);
    
    return res.json({
      success: true,
      data: matrix,
      message: 'Traceability matrix generated successfully'
    } as ApiResponse<TraceabilityMatrix>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate traceability matrix'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/traceability/requirements:
 *   get:
 *     summary: Get requirements traceability
 *     description: Get traceability information for requirements to API endpoints and test cases
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: requirementId
 *         schema:
 *           type: string
 *         description: Specific requirement ID (optional)
 *     responses:
 *       200:
 *         description: Requirements traceability retrieved successfully
 *       400:
 *         description: Project ID is required
 *       500:
 *         description: Internal server error
 */
traceabilityRouter.get('/requirements', async (req: Request, res: Response) => {
  try {
    const { projectId, requirementId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse);
    }

    const traceabilityService = new TraceabilityService();
    const traceability = await traceabilityService.getRequirementsTraceability(
      projectId as string,
      requirementId as string
    );
    
    return res.json({
      success: true,
      data: traceability,
      message: 'Requirements traceability retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve requirements traceability'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/traceability/coverage:
 *   get:
 *     summary: Get test coverage analysis
 *     description: Get detailed test coverage analysis for API endpoints
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Test coverage analysis retrieved successfully
 *       400:
 *         description: Project ID is required
 *       500:
 *         description: Internal server error
 */
traceabilityRouter.get('/coverage', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse);
    }

    const traceabilityService = new TraceabilityService();
    const coverage = await traceabilityService.getCoverageAnalysis(projectId as string);
    
    return res.json({
      success: true,
      data: coverage,
      message: 'Test coverage analysis retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve test coverage analysis'
    } as ApiResponse);
  }
});

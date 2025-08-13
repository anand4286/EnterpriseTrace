import { Router, Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';
import { ApiResponse, DashboardData } from '../types';

export const dashboardRouter = Router();

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get dashboard overview
 *     description: Get comprehensive dashboard data including project info, metrics, and recent activity
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema:
 *           type: string
 *         description: Project ID to filter dashboard data
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
dashboardRouter.get('/overview', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    
    const dashboardService = new DashboardService();
    const dashboardData = await dashboardService.getDashboardData(projectId as string);
    
    res.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully'
    } as ApiResponse<DashboardData>);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve dashboard data'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/dashboard/project:
 *   put:
 *     summary: Update project information
 *     description: Update project details and configuration
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
 *               version:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
dashboardRouter.put('/project', async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    
    // Here you would typically update the project in your database
    console.log('Updating project:', projectData);
    
    res.json({
      success: true,
      data: projectData,
      message: 'Project updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update project'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/dashboard/component:
 *   post:
 *     summary: Create a new component
 *     description: Add a new component to the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Component created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update an existing component
 *     description: Update component details and status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Component updated successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
dashboardRouter.post('/component', async (req: Request, res: Response) => {
  try {
    const componentData = req.body;
    
    // Here you would typically create the component in your database
    console.log('Creating component:', componentData);
    
    res.status(201).json({
      success: true,
      data: { ...componentData, id: Date.now().toString() },
      message: 'Component created successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create component'
    } as ApiResponse);
  }
});

dashboardRouter.put('/component', async (req: Request, res: Response) => {
  try {
    const componentData = req.body;
    
    // Here you would typically update the component in your database
    console.log('Updating component:', componentData);
    
    res.json({
      success: true,
      data: componentData,
      message: 'Component updated successfully'
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update component'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Get test metrics
 *     description: Get detailed test metrics for a project
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Test metrics retrieved successfully
 *       400:
 *         description: Project ID is required
 *       500:
 *         description: Internal server error
 */
dashboardRouter.get('/metrics', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.query;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse);
    }

    const dashboardService = new DashboardService();
    const metrics = await dashboardService.getTestMetrics(projectId as string);
    
    return res.json({
      success: true,
      data: metrics,
      message: 'Test metrics retrieved successfully'
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve test metrics'
    } as ApiResponse);
  }
});

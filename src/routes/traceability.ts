import { Router, Request, Response } from 'express';
import { TraceabilityService } from '../services/TraceabilityService';
import { ApiResponse, TraceabilityMatrix } from '../types';

export const traceabilityRouter = Router();

// In-memory storage for demonstration (in production, use database)
let userJourneys: any[] = [
  {
    id: '1',
    title: 'User Registration and Onboarding',
    description: 'Complete user registration flow from sign-up to profile completion',
    persona: 'New User',
    priority: 'High',
    status: 'Approved',
    businessScenarios: ['1', '2'],
    createdDate: '2024-08-01',
    owner: 'Product Team',
    tags: ['Authentication', 'Onboarding'],
    jiraLink: 'PROJ-123',
    confluenceLink: 'https://confluence.company.com/user-journeys/registration'
  },
  {
    id: '2',
    title: 'E-commerce Purchase Flow',
    description: 'End-to-end purchase experience from product selection to order confirmation',
    persona: 'Customer',
    priority: 'High',
    status: 'Approved',
    businessScenarios: ['3', '4', '5'],
    createdDate: '2024-08-05',
    owner: 'E-commerce Team',
    tags: ['Purchase', 'Payment'],
    jiraLink: 'PROJ-456',
    confluenceLink: 'https://confluence.company.com/user-journeys/purchase'
  }
];

let businessScenarios: any[] = [
  {
    id: '1',
    title: 'Email Registration',
    description: 'User registers using email and password',
    userJourneyId: '1',
    acceptanceCriteria: [
      { id: '1', description: 'User can enter valid email address', status: 'Completed' },
      { id: '2', description: 'Password meets security requirements', status: 'Completed' },
      { id: '3', description: 'Email verification sent successfully', status: 'Completed' }
    ],
    testCases: ['1', '2', '3'],
    priority: 'High',
    status: 'Completed',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    channels: ['Web', 'Mobile'],
    owner: 'Dev Team A',
    jiraTicket: 'PROJ-124',
    confluenceLink: 'https://confluence.company.com/scenarios/email-registration'
  }
];

let testCases: any[] = [
  {
    id: '1',
    title: 'Valid Email Registration',
    description: 'Test successful registration with valid email and password',
    businessScenarioId: '1',
    type: 'E2E',
    automationStatus: 'Automated',
    status: 'Passed',
    priority: 'High',
    assignee: 'QA Team',
    lastExecuted: '2024-08-13',
    executionResult: 'Pass',
    githubLink: 'https://github.com/company/tests/registration.spec.ts',
    defects: [],
    techStack: ['Playwright', 'TypeScript'],
    channels: ['Web']
  }
];

// GET /api/traceability/overview - Get overview metrics
traceabilityRouter.get('/overview', (req: Request, res: Response) => {
  try {
    const totalUserJourneys = userJourneys.length;
    const totalBusinessScenarios = businessScenarios.length;
    const totalTestCases = testCases.length;
    const automatedTests = testCases.filter(tc => tc.automationStatus === 'Automated').length;
    const passedTests = testCases.filter(tc => tc.executionResult === 'Pass').length;
    const openDefects = testCases.flatMap(tc => tc.defects || []).filter(d => d.status === 'Open').length;

    return res.json({
      success: true,
      data: {
        overview: {
          totalUserJourneys,
          totalBusinessScenarios,
          totalTestCases,
          automatedTests,
          passedTests,
          openDefects,
          coveragePercentage: totalTestCases > 0 ? Math.round((passedTests / totalTestCases) * 100) : 0,
          automationPercentage: totalTestCases > 0 ? Math.round((automatedTests / totalTestCases) * 100) : 0
        },
        userJourneys,
        businessScenarios,
        testCases
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch traceability overview'
    });
  }
});

// GET /api/traceability/user-journeys - Get all user journeys
traceabilityRouter.get('/user-journeys', (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: userJourneys
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch user journeys'
    });
  }
});

// POST /api/traceability/user-journeys - Create user journey
traceabilityRouter.post('/user-journeys', (req: Request, res: Response) => {
  try {
    const newJourney = {
      id: Date.now().toString(),
      ...req.body,
      createdDate: new Date().toISOString().split('T')[0],
      businessScenarios: []
    };

    userJourneys.push(newJourney);
    
    return res.status(201).json({
      success: true,
      data: newJourney,
      message: 'User journey created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create user journey'
    });
  }
});

// PUT /api/traceability/user-journeys/:id - Update user journey
traceabilityRouter.put('/user-journeys/:id', (req: Request, res: Response) => {
  try {
    const journeyIndex = userJourneys.findIndex(j => j.id === req.params.id);
    if (journeyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User journey not found'
      });
    }

    userJourneys[journeyIndex] = { ...userJourneys[journeyIndex], ...req.body };
    
    return res.json({
      success: true,
      data: userJourneys[journeyIndex],
      message: 'User journey updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update user journey'
    });
  }
});

// DELETE /api/traceability/user-journeys/:id - Delete user journey
traceabilityRouter.delete('/user-journeys/:id', (req: Request, res: Response) => {
  try {
    const journeyIndex = userJourneys.findIndex(j => j.id === req.params.id);
    if (journeyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User journey not found'
      });
    }

    const deletedJourney = userJourneys.splice(journeyIndex, 1)[0];
    
    return res.json({
      success: true,
      data: deletedJourney,
      message: 'User journey deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user journey'
    });
  }
});

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

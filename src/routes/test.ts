import { Router, Request, Response } from 'express';
import { TestService } from '../services/TestService';
import { ApiResponse, TestResult } from '../types';

export const testRouter = Router();

/**
 * @swagger
 * /api/test/run:
 *   post:
 *     summary: Run test suite
 *     description: Execute test suite for specified endpoints or entire project
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
 *               endpoints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Specific endpoints to test (optional)
 *               testType:
 *                 type: string
 *                 enum: [api, ui, e2e, all]
 *                 description: Type of tests to run
 *     responses:
 *       200:
 *         description: Test execution started successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
testRouter.post('/run', async (req: Request, res: Response) => {
  try {
    const { projectId, endpoints, testType = 'all' } = req.body;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse);
    }

    const testService = new TestService();
    const testRun = await testService.runTests(projectId, { endpoints, testType });
    
    return res.json({
      success: true,
      data: testRun,
      message: 'Test execution started successfully'
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start test execution'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/test/results:
 *   get:
 *     summary: Get test results
 *     description: Retrieve test results for a project or specific test run
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: testRunId
 *         schema:
 *           type: string
 *         description: Specific test run ID (optional)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [passed, failed, skipped, all]
 *         description: Filter by test status
 *     responses:
 *       200:
 *         description: Test results retrieved successfully
 *       400:
 *         description: Project ID is required
 *       500:
 *         description: Internal server error
 */
testRouter.get('/results', async (req: Request, res: Response) => {
  try {
    const { projectId, testRunId, status = 'all' } = req.query;
    
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse);
    }

    const testService = new TestService();
    const results = await testService.getTestResults(projectId as string, {
      testRunId: testRunId as string,
      status: status as string
    });
    
    return res.json({
      success: true,
      data: results,
      message: 'Test results retrieved successfully'
    } as ApiResponse<TestResult[]>);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve test results'
    } as ApiResponse);
  }
});

/**
 * @swagger
 * /api/test/generate:
 *   post:
 *     summary: Generate test cases
 *     description: Generate test cases from OpenAPI specification
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
 *               testFramework:
 *                 type: string
 *                 enum: [playwright, jest, cypress]
 *                 description: Target test framework
 *     responses:
 *       200:
 *         description: Test cases generated successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
testRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { projectId, openApiSpec, testFramework = 'playwright' } = req.body;
    
    if (!projectId || !openApiSpec) {
      return res.status(400).json({
        success: false,
        error: 'Project ID and OpenAPI specification are required'
      } as ApiResponse);
    }

    const testService = new TestService();
    const testCases = await testService.generateTestCases(projectId, openApiSpec, testFramework);
    
    return res.json({
      success: true,
      data: testCases,
      message: 'Test cases generated successfully'
    } as ApiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate test cases'
    } as ApiResponse);
  }
});

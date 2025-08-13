import { Router, Request, Response } from 'express';

const router = Router();

// In-memory storage for releases (in production, this would be a database)
let releases: any[] = [
  {
    id: '1',
    name: 'Q4 Platform Release',
    version: '2.1.0',
    status: 'development',
    progress: 65,
    startDate: '2024-10-01T00:00:00.000Z',
    targetDate: '2024-12-15T00:00:00.000Z',
    squads: ['1', '2'],
    description: 'Major platform updates including new user management features and API improvements',
    risks: [
      {
        id: '1',
        title: 'Database Migration Complexity',
        severity: 'high',
        status: 'open',
        description: 'Complex schema changes required for new features',
        owner: 'DevOps Team'
      }
    ],
    readinessChecks: [
      {
        id: '1',
        item: 'Security Review',
        category: 'security',
        status: 'completed',
        dueDate: '2024-11-01T00:00:00.000Z',
        assignee: 'Security Team'
      }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Update',
    version: '1.5.0',
    status: 'testing',
    progress: 85,
    startDate: '2024-09-15T00:00:00.000Z',
    targetDate: '2024-11-30T00:00:00.000Z',
    squads: ['3'],
    description: 'Enhanced mobile experience with new features and performance improvements',
    risks: [
      {
        id: '2',
        title: 'App Store Review Process',
        severity: 'medium',
        status: 'mitigated',
        description: 'Potential delays in app store approval process',
        owner: 'Mobile Team'
      }
    ],
    readinessChecks: [
      {
        id: '2',
        item: 'Performance Testing',
        category: 'testing',
        status: 'in-progress',
        dueDate: '2024-11-15T00:00:00.000Z',
        assignee: 'QA Team'
      }
    ]
  }
];

// GET /api/releases - Get all releases
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: releases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch releases'
    });
  }
});

// GET /api/releases/:id - Get a specific release
router.get('/:id', (req: Request, res: Response) => {
  try {
    const release = releases.find(r => r.id === req.params.id);
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }
    
    return res.json({
      success: true,
      data: release
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch release'
    });
  }
});

// POST /api/releases - Create a new release
router.post('/', (req: Request, res: Response) => {
  try {
    const newRelease = {
      id: Date.now().toString(),
      name: req.body.name,
      version: req.body.version,
      status: req.body.status || 'planning',
      progress: req.body.progress || 0,
      startDate: req.body.startDate,
      targetDate: req.body.targetDate,
      squads: req.body.squads || [],
      description: req.body.description || '',
      risks: req.body.risks || [],
      readinessChecks: req.body.readinessChecks || []
    };

    releases.push(newRelease);
    
    res.status(201).json({
      success: true,
      data: newRelease,
      message: 'Release created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create release'
    });
  }
});

// PUT /api/releases/:id - Update a release
router.put('/:id', (req: Request, res: Response) => {
  try {
    const releaseIndex = releases.findIndex(r => r.id === req.params.id);
    if (releaseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }

    const updatedRelease = {
      ...releases[releaseIndex],
      ...req.body,
      id: req.params.id // Ensure ID doesn't change
    };

    releases[releaseIndex] = updatedRelease;
    
    return res.json({
      success: true,
      data: updatedRelease,
      message: 'Release updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update release'
    });
  }
});

// DELETE /api/releases/:id - Delete a release
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const releaseIndex = releases.findIndex(r => r.id === req.params.id);
    if (releaseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }

    const deletedRelease = releases.splice(releaseIndex, 1)[0];
    
    return res.json({
      success: true,
      data: deletedRelease,
      message: 'Release deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete release'
    });
  }
});

// POST /api/releases/:id/risks - Add a risk to a release
router.post('/:id/risks', (req: Request, res: Response) => {
  try {
    const release = releases.find(r => r.id === req.params.id);
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }

    const newRisk = {
      id: Date.now().toString(),
      title: req.body.title,
      severity: req.body.severity,
      status: req.body.status || 'open',
      description: req.body.description || '',
      owner: req.body.owner || ''
    };

    release.risks.push(newRisk);
    
    return res.status(201).json({
      success: true,
      data: newRisk,
      message: 'Risk added successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to add risk'
    });
  }
});

// PUT /api/releases/:id/risks/:riskId - Update a risk
router.put('/:id/risks/:riskId', (req: Request, res: Response) => {
  try {
    const release = releases.find(r => r.id === req.params.id);
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }

    const riskIndex = release.risks.findIndex((r: any) => r.id === req.params.riskId);
    if (riskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Risk not found'
      });
    }

    const updatedRisk = {
      ...release.risks[riskIndex],
      ...req.body,
      id: req.params.riskId
    };

    release.risks[riskIndex] = updatedRisk;
    
    return res.json({
      success: true,
      data: updatedRisk,
      message: 'Risk updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update risk'
    });
  }
});

// DELETE /api/releases/:id/risks/:riskId - Delete a risk
router.delete('/:id/risks/:riskId', (req: Request, res: Response) => {
  try {
    const release = releases.find(r => r.id === req.params.id);
    if (!release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found'
      });
    }

    const riskIndex = release.risks.findIndex((r: any) => r.id === req.params.riskId);
    if (riskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Risk not found'
      });
    }

    const deletedRisk = release.risks.splice(riskIndex, 1)[0];
    
    return res.json({
      success: true,
      data: deletedRisk,
      message: 'Risk deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to delete risk'
    });
  }
});

export { router as releaseRouter };

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Groups,
  Computer,
  Assessment,
  CloudUpload,
  Settings,
  Business,
  Group,
  Person,
  TrendingUp,
  Security,
  Speed,
  Timeline,
  Refresh
} from '@mui/icons-material';
// import ReactECharts from 'echarts-for-react'; // Commented out - dependency not installed

interface DashboardMetrics {
  totalProjects: number;
  totalUsers: number;
  totalSquads: number;
  totalEnvironments: number;
  totalReleases: number;
  totalChapters: number;
  testCoverage: number;
  successRate: number;
  activeIssues: number;
  resolvedIssues: number;
  businessRequirements: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  technicalConfig: {
    healthy: number;
    warning: number;
    error: number;
  };
  userActivity: {
    active: number;
    inactive: number;
  };
  environmentStatus: {
    production: number;
    staging: number;
    development: number;
  };
  releaseStatus: {
    scheduled: number;
    inProgress: number;
    completed: number;
    failed: number;
  };
  chapterProgress: {
    notStarted: number;
    inProgress: number;
    completed: number;
  };
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDashboardData = () => {
    try {
      // Load data from all localStorage stores
      let businessRequirements = JSON.parse(localStorage.getItem('businessRequirements') || '[]');
      let technicalConfiguration = JSON.parse(localStorage.getItem('technicalConfiguration') || '[]');
      let userManagement = JSON.parse(localStorage.getItem('userManagement') || '[]');
      let environmentManagement = JSON.parse(localStorage.getItem('environmentManagement') || '[]');
      let releaseManagement = JSON.parse(localStorage.getItem('releaseManagement') || '[]');
      let chapterManagement = JSON.parse(localStorage.getItem('chapterManagement') || '[]');

      // If no data exists, populate with sample data for demonstration
      if (businessRequirements.length === 0) {
        businessRequirements = [
          { id: '1', title: 'User Authentication System', status: 'approved', priority: 'high', assignee: 'John Doe' },
          { id: '2', title: 'Payment Gateway Integration', status: 'pending', priority: 'high', assignee: 'Jane Smith' },
          { id: '3', title: 'Mobile App Dashboard', status: 'approved', priority: 'medium', assignee: 'Mike Johnson' },
          { id: '4', title: 'Email Notification Service', status: 'rejected', priority: 'low', assignee: 'Sarah Wilson' },
          { id: '5', title: 'Data Analytics Module', status: 'approved', priority: 'high', assignee: 'David Brown' }
        ];
      }

      if (technicalConfiguration.length === 0) {
        technicalConfiguration = [
          { id: '1', name: 'API Gateway', status: 'healthy', type: 'infrastructure', lastCheck: '2024-08-13' },
          { id: '2', name: 'Database Cluster', status: 'healthy', type: 'database', lastCheck: '2024-08-13' },
          { id: '3', name: 'Load Balancer', status: 'warning', type: 'infrastructure', lastCheck: '2024-08-13' },
          { id: '4', name: 'Cache Service', status: 'healthy', type: 'service', lastCheck: '2024-08-13' },
          { id: '5', name: 'Message Queue', status: 'error', type: 'service', lastCheck: '2024-08-13' },
          { id: '6', name: 'Monitoring System', status: 'healthy', type: 'observability', lastCheck: '2024-08-13' }
        ];
      }

      if (userManagement.length === 0) {
        userManagement = [
          { id: '1', name: 'John Doe', email: 'john@company.com', squad: 'Frontend', status: 'active', role: 'Developer' },
          { id: '2', name: 'Jane Smith', email: 'jane@company.com', squad: 'Backend', status: 'active', role: 'Senior Developer' },
          { id: '3', name: 'Mike Johnson', email: 'mike@company.com', squad: 'Mobile', status: 'active', role: 'Tech Lead' },
          { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com', squad: 'DevOps', status: 'inactive', role: 'Engineer' },
          { id: '5', name: 'David Brown', email: 'david@company.com', squad: 'Data', status: 'active', role: 'Data Engineer' },
          { id: '6', name: 'Lisa Garcia', email: 'lisa@company.com', squad: 'QA', status: 'active', role: 'QA Engineer' }
        ];
      }

      if (environmentManagement.length === 0) {
        environmentManagement = [
          { id: '1', name: 'Production', type: 'production', status: 'healthy', url: 'https://api.company.com' },
          { id: '2', name: 'Staging', type: 'staging', status: 'healthy', url: 'https://staging.company.com' },
          { id: '3', name: 'Development', type: 'development', status: 'healthy', url: 'https://dev.company.com' },
          { id: '4', name: 'Testing', type: 'development', status: 'warning', url: 'https://test.company.com' }
        ];
      }

      if (releaseManagement.length === 0) {
        releaseManagement = [
          { id: '1', version: 'v2.1.0', status: 'completed', releaseDate: '2024-08-10', features: ['New Dashboard', 'API Improvements'] },
          { id: '2', version: 'v2.2.0', status: 'in-progress', releaseDate: '2024-08-20', features: ['Mobile Support', 'Performance Optimization'] },
          { id: '3', version: 'v2.3.0', status: 'scheduled', releaseDate: '2024-09-01', features: ['Analytics Dashboard', 'User Management'] },
          { id: '4', version: 'v2.0.5', status: 'failed', releaseDate: '2024-08-05', features: ['Bug Fixes', 'Security Updates'] }
        ];
      }

      if (chapterManagement.length === 0) {
        chapterManagement = [
          { id: '1', name: 'Frontend Chapter', status: 'in-progress', lead: 'John Doe', members: 8, focus: 'React Best Practices' },
          { id: '2', name: 'Backend Chapter', status: 'completed', lead: 'Jane Smith', members: 6, focus: 'Microservices Architecture' },
          { id: '3', name: 'DevOps Chapter', status: 'not-started', lead: 'Mike Johnson', members: 4, focus: 'Infrastructure as Code' },
          { id: '4', name: 'Data Chapter', status: 'in-progress', lead: 'David Brown', members: 5, focus: 'Data Pipeline Optimization' }
        ];
      }

      // Calculate aggregated metrics
      const aggregatedMetrics: DashboardMetrics = {
        totalProjects: businessRequirements.length,
        totalUsers: userManagement.length,
        totalSquads: new Set(userManagement.map((user: any) => user.squad)).size,
        totalEnvironments: environmentManagement.length,
        totalReleases: releaseManagement.length,
        totalChapters: chapterManagement.length,
        testCoverage: calculateTestCoverage(technicalConfiguration),
        successRate: calculateSuccessRate(technicalConfiguration),
        activeIssues: technicalConfiguration.filter((config: any) => config.status === 'error').length,
        resolvedIssues: technicalConfiguration.filter((config: any) => config.status === 'healthy').length,
        businessRequirements: {
          total: businessRequirements.length,
          approved: businessRequirements.filter((req: any) => req.status === 'approved').length,
          pending: businessRequirements.filter((req: any) => req.status === 'pending').length,
          rejected: businessRequirements.filter((req: any) => req.status === 'rejected').length,
        },
        technicalConfig: {
          healthy: technicalConfiguration.filter((config: any) => config.status === 'healthy').length,
          warning: technicalConfiguration.filter((config: any) => config.status === 'warning').length,
          error: technicalConfiguration.filter((config: any) => config.status === 'error').length,
        },
        userActivity: {
          active: userManagement.filter((user: any) => user.status === 'active').length,
          inactive: userManagement.filter((user: any) => user.status !== 'active').length,
        },
        environmentStatus: {
          production: environmentManagement.filter((env: any) => env.type === 'production').length,
          staging: environmentManagement.filter((env: any) => env.type === 'staging').length,
          development: environmentManagement.filter((env: any) => env.type === 'development').length,
        },
        releaseStatus: {
          scheduled: releaseManagement.filter((release: any) => release.status === 'scheduled').length,
          inProgress: releaseManagement.filter((release: any) => release.status === 'in-progress').length,
          completed: releaseManagement.filter((release: any) => release.status === 'completed').length,
          failed: releaseManagement.filter((release: any) => release.status === 'failed').length,
        },
        chapterProgress: {
          notStarted: chapterManagement.filter((chapter: any) => chapter.status === 'not-started').length,
          inProgress: chapterManagement.filter((chapter: any) => chapter.status === 'in-progress').length,
          completed: chapterManagement.filter((chapter: any) => chapter.status === 'completed').length,
        }
      };

      setMetrics(aggregatedMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const calculateTestCoverage = (technicalConfig: any[]): number => {
    if (technicalConfig.length === 0) return 0;
    const healthyConfigs = technicalConfig.filter(config => config.status === 'healthy').length;
    return Math.round((healthyConfigs / technicalConfig.length) * 100);
  };

  const calculateSuccessRate = (technicalConfig: any[]): number => {
    if (technicalConfig.length === 0) return 0;
    const successfulConfigs = technicalConfig.filter(config => 
      config.status === 'healthy' || config.status === 'warning'
    ).length;
    return Math.round((successfulConfigs / technicalConfig.length) * 100);
  };

  // ECharts options
  const getBusinessRequirementsOption = () => ({
    title: {
      text: '',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155'
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#334155'
          },
          scale: true,
          scaleSize: 10
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: metrics?.businessRequirements.approved || 0, 
            name: 'Approved',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#10b981' },
                  { offset: 1, color: '#059669' }
                ]
              }
            }
          },
          { 
            value: metrics?.businessRequirements.pending || 0, 
            name: 'Pending',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#f59e0b' },
                  { offset: 1, color: '#d97706' }
                ]
              }
            }
          },
          { 
            value: metrics?.businessRequirements.rejected || 0, 
            name: 'Rejected',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#ef4444' },
                  { offset: 1, color: '#dc2626' }
                ]
              }
            }
          }
        ]
      }
    ]
  });

  const getTechnicalConfigOption = () => ({
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155'
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Healthy', 'Warning', 'Error'],
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: [
          {
            value: metrics?.technicalConfig.healthy || 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  { offset: 0, color: '#10b981' },
                  { offset: 1, color: '#34d399' }
                ]
              }
            }
          },
          {
            value: metrics?.technicalConfig.warning || 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  { offset: 0, color: '#f59e0b' },
                  { offset: 1, color: '#fbbf24' }
                ]
              }
            }
          },
          {
            value: metrics?.technicalConfig.error || 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  { offset: 0, color: '#ef4444' },
                  { offset: 1, color: '#f87171' }
                ]
              }
            }
          }
        ],
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  });

  const getEnvironmentDistributionOption = () => ({
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155'
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Production', 'Staging', 'Development'],
      axisLine: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#e2e8f0'
        }
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'bar',
        data: [
          {
            value: metrics?.environmentStatus.production || 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  { offset: 0, color: '#0ea5e9' },
                  { offset: 1, color: '#38bdf8' }
                ]
              }
            }
          },
          {
            value: metrics?.environmentStatus.staging || 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  { offset: 0, color: '#8b5cf6' },
                  { offset: 1, color: '#a78bfa' }
                ]
              }
            }
          },
          {
            value: metrics?.environmentStatus.development || 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0, y: 1, x2: 0, y2: 0,
                colorStops: [
                  { offset: 0, color: '#06b6d4' },
                  { offset: 1, color: '#22d3ee' }
                ]
              }
            }
          }
        ],
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ]
  });

  const getReleaseStatusOption = () => ({
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155'
      },
      extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0%',
      textStyle: {
        color: '#64748b',
        fontSize: 12
      }
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['50%', '45%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          scale: true,
          scaleSize: 10
        },
        data: [
          { 
            value: metrics?.releaseStatus.scheduled || 0, 
            name: 'Scheduled',
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.3, y: 0.3, r: 0.8,
                colorStops: [
                  { offset: 0, color: '#60a5fa' },
                  { offset: 1, color: '#3b82f6' }
                ]
              }
            }
          },
          { 
            value: metrics?.releaseStatus.inProgress || 0, 
            name: 'In Progress',
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.3, y: 0.3, r: 0.8,
                colorStops: [
                  { offset: 0, color: '#fbbf24' },
                  { offset: 1, color: '#f59e0b' }
                ]
              }
            }
          },
          { 
            value: metrics?.releaseStatus.completed || 0, 
            name: 'Completed',
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.3, y: 0.3, r: 0.8,
                colorStops: [
                  { offset: 0, color: '#34d399' },
                  { offset: 1, color: '#10b981' }
                ]
              }
            }
          },
          { 
            value: metrics?.releaseStatus.failed || 0, 
            name: 'Failed',
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.3, y: 0.3, r: 0.8,
                colorStops: [
                  { offset: 0, color: '#f87171' },
                  { offset: 1, color: '#ef4444' }
                ]
              }
            }
          }
        ]
      }
    ]
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-soft p-8">
            <LinearProgress className="mb-4" />
            <Typography variant="h6" className="text-center text-slate-600">
              Loading Enterprise Dashboard...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert severity="error" className="shadow-soft rounded-xl">
            Failed to load dashboard data. Please try refreshing the page.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Enterprise Dashboard
              </h1>
              <p className="text-slate-500 text-lg">
                Comprehensive view of all projects, teams, and system health
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-slate-500">Last Updated</div>
                <div className="text-slate-700 font-medium">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <IconButton 
                onClick={loadDashboardData}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-medium"
              >
                <Refresh />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-strong transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{metrics.totalProjects}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+12% this month</span>
                </div>
              </div>
              <Avatar className="bg-white/20 w-16 h-16">
                <Business className="w-8 h-8" />
              </Avatar>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-strong transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold">{metrics.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+8% this month</span>
                </div>
              </div>
              <Avatar className="bg-white/20 w-16 h-16">
                <Person className="w-8 h-8" />
              </Avatar>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-strong transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Active Squads</p>
                <p className="text-3xl font-bold">{metrics.totalSquads}</p>
                <div className="flex items-center mt-2">
                  <Timeline className="w-4 h-4 mr-1" />
                  <span className="text-sm">All active</span>
                </div>
              </div>
              <Avatar className="bg-white/20 w-16 h-16">
                <Group className="w-8 h-8" />
              </Avatar>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-strong transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-1">Test Coverage</p>
                <p className="text-3xl font-bold">{metrics.testCoverage}%</p>
                <div className="flex items-center mt-2">
                  <Speed className="w-4 h-4 mr-1" />
                  <span className="text-sm">Above target</span>
                </div>
              </div>
              <Avatar className="bg-white/20 w-16 h-16">
                <Assessment className="w-8 h-8" />
              </Avatar>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Business Requirements Status */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50 hover:shadow-medium transition-all duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Business Requirements Status
            </h3>
            <div className="h-80">
              <div 
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #ccc',
                  borderRadius: '8px'
                }}
              >
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Chart Placeholder - Business Requirements
                </span>
              </div>
            </div>
          </div>

          {/* Technical Configuration Health */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50 hover:shadow-medium transition-all duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Technical Configuration Health
            </h3>
            <div className="h-80">
              <div 
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #ccc',
                  borderRadius: '8px'
                }}
              >
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Chart Placeholder - Technical Configuration
                </span>
              </div>
            </div>
          </div>

          {/* Environment Distribution */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50 hover:shadow-medium transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mr-3"></div>
              Environment Distribution
            </h3>
            <div className="h-80">
              <div 
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #ccc',
                  borderRadius: '8px'
                }}
              >
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Chart Placeholder - Environment Distribution
                </span>
              </div>
            </div>
          </div>

          {/* Release Status */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50 hover:shadow-medium transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-3"></div>
              Release Status
            </h3>
            <div className="h-80">
              <div 
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #ccc',
                  borderRadius: '8px'
                }}
              >
                <span style={{ color: '#666', fontSize: '14px' }}>
                  Chart Placeholder - Release Status
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Security className="w-6 h-6 text-emerald-500 mr-3" />
              System Health Summary
            </h3>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="text-slate-600 font-semibold">Metric</TableCell>
                    <TableCell align="right" className="text-slate-600 font-semibold">Value</TableCell>
                    <TableCell align="right" className="text-slate-600 font-semibold">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="text-slate-700">Test Coverage</TableCell>
                    <TableCell align="right" className="text-slate-700 font-medium">{metrics.testCoverage}%</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={metrics.testCoverage >= 80 ? 'Excellent' : metrics.testCoverage >= 60 ? 'Good' : 'Needs Improvement'}
                        color={metrics.testCoverage >= 80 ? 'success' : metrics.testCoverage >= 60 ? 'warning' : 'error'}
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="text-slate-700">Success Rate</TableCell>
                    <TableCell align="right" className="text-slate-700 font-medium">{metrics.successRate}%</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={metrics.successRate >= 90 ? 'Excellent' : metrics.successRate >= 70 ? 'Good' : 'Needs Attention'}
                        color={metrics.successRate >= 90 ? 'success' : metrics.successRate >= 70 ? 'warning' : 'error'}
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="text-slate-700">Active Issues</TableCell>
                    <TableCell align="right" className="text-slate-700 font-medium">{metrics.activeIssues}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={metrics.activeIssues === 0 ? 'None' : metrics.activeIssues <= 2 ? 'Low' : 'High'}
                        color={metrics.activeIssues === 0 ? 'success' : metrics.activeIssues <= 2 ? 'warning' : 'error'}
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-slate-50">
                    <TableCell className="text-slate-700">Resolved Issues</TableCell>
                    <TableCell align="right" className="text-slate-700 font-medium">{metrics.resolvedIssues}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label="Resolved"
                        color="success"
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Quick Statistics */}
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-200/50">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <Speed className="w-6 h-6 text-blue-500 mr-3" />
              Quick Statistics
            </h3>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <Computer className="w-8 h-8 text-blue-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Environments</p>
                  <p className="text-slate-600">{metrics.totalEnvironments} total environments configured</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <CloudUpload className="w-8 h-8 text-emerald-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Releases</p>
                  <p className="text-slate-600">{metrics.totalReleases} releases managed</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <Groups className="w-8 h-8 text-purple-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Team Management</p>
                  <p className="text-slate-600">{metrics.totalUsers} users across {metrics.totalSquads} squads</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <Settings className="w-8 h-8 text-amber-500 mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Chapters</p>
                  <p className="text-slate-600">{metrics.totalChapters} chapters in progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Cloud as CloudIcon,
  Computer as ServerIcon,
  Api as ApiIcon,
  CalendarToday as BookingIcon,
  CheckCircle as AvailableIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Lock as LockedIcon,
  Public as PublicIcon,
  ViewList as ListViewIcon,
  Event as CalendarViewIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';

interface Environment {
  id: string;
  name: string;
  type: 'development' | 'testing' | 'staging' | 'production' | 'demo';
  status: 'available' | 'booked' | 'maintenance' | 'down';
  description: string;
  url: string;
  region: string;
  capacity: number;
  currentUsage: number;
  apis: ApiEndpoint[];
  booking?: EnvironmentBooking;
  lastUpdated: string;
  version: string;
  owner: string;
  tags: string[];
}

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number; // in ms
  uptime: number; // percentage
  lastChecked: string;
  authentication: 'none' | 'api_key' | 'oauth' | 'bearer';
  documentation?: string;
}

interface EnvironmentBooking {
  id: string;
  bookedBy: string;
  purpose: string;
  startDate: string;
  endDate: string;
  extendable: boolean;
  contact: string;
  notes?: string;
}

const EnvironmentManagement: React.FC = () => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [environmentDialogOpen, setEnvironmentDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);
  const [editingApi, setEditingApi] = useState<ApiEndpoint | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');

  // Form states
  const [environmentForm, setEnvironmentForm] = useState({
    name: '',
    type: 'development' as Environment['type'],
    description: '',
    url: '',
    region: '',
    capacity: 100,
    version: '',
    owner: '',
    tags: ''
  });

  const [bookingForm, setBookingForm] = useState({
    bookedBy: '',
    purpose: '',
    startDate: '',
    endDate: '',
    extendable: true,
    contact: '',
    notes: ''
  });

  const [apiForm, setApiForm] = useState({
    name: '',
    url: '',
    method: 'GET' as ApiEndpoint['method'],
    authentication: 'none' as ApiEndpoint['authentication'],
    documentation: ''
  });

  // Mock data initialization
  useEffect(() => {
    loadEnvironmentsFromStorage();
  }, []);

  // Auto-save to localStorage whenever environments change
  useEffect(() => {
    if (environments.length > 0) {
      localStorage.setItem('environmentManagement_environments', JSON.stringify(environments));
    }
  }, [environments]);

  const initializeSampleEnvironments = (): Environment[] => [
    {
      id: '1',
      name: 'Development Environment',
      type: 'development',
      status: 'available',
      description: 'Main development environment for feature development and testing',
      url: 'https://dev-api.company.com',
      region: 'us-east-1',
      capacity: 100,
      currentUsage: 45,
      version: '2.1.0-dev',
      owner: 'Engineering Team',
      tags: ['nodejs', 'react', 'postgresql'],
      lastUpdated: '2024-01-15T10:30:00Z',
      apis: [
        {
          id: 'api-1',
          name: 'User Service',
          url: 'https://dev-api.company.com/users',
          method: 'GET',
          status: 'healthy',
          responseTime: 120,
          uptime: 99.5,
          lastChecked: '2024-01-15T10:25:00Z',
          authentication: 'bearer',
          documentation: 'https://docs.company.com/users'
        },
        {
          id: 'api-2',
          name: 'Product Catalog',
          url: 'https://dev-api.company.com/products',
          method: 'GET',
          status: 'healthy',
          responseTime: 95,
          uptime: 98.8,
          lastChecked: '2024-01-15T10:25:00Z',
          authentication: 'api_key'
        },
        {
          id: 'api-3',
          name: 'Order Processing',
          url: 'https://dev-api.company.com/orders',
          method: 'POST',
          status: 'degraded',
          responseTime: 850,
          uptime: 97.2,
          lastChecked: '2024-01-15T10:25:00Z',
          authentication: 'oauth'
        }
      ]
    },
    {
      id: '2',
      name: 'Testing Environment',
      type: 'testing',
      status: 'booked',
      description: 'Dedicated testing environment for QA team',
      url: 'https://test-api.company.com',
      region: 'us-west-2',
      capacity: 80,
      currentUsage: 60,
      version: '2.0.5',
      owner: 'QA Team',
      tags: ['testing', 'automation', 'selenium'],
      lastUpdated: '2024-01-15T09:15:00Z',
      booking: {
        id: 'booking-1',
        bookedBy: 'QA Team',
        purpose: 'Sprint 15 Testing - Payment Gateway Integration',
        startDate: '2024-01-14',
        endDate: '2024-01-18',
        extendable: true,
        contact: 'qa-team@company.com',
        notes: 'Critical payment testing - please do not disturb'
      },
      apis: [
        {
          id: 'api-4',
          name: 'Payment Gateway',
          url: 'https://test-api.company.com/payments',
          method: 'POST',
          status: 'healthy',
          responseTime: 200,
          uptime: 99.9,
          lastChecked: '2024-01-15T10:20:00Z',
          authentication: 'oauth'
        }
      ]
    },
    {
      id: '3',
      name: 'Staging Environment',
      type: 'staging',
      status: 'booked',
      description: 'Pre-production staging environment',
      url: 'https://staging-api.company.com',
      region: 'eu-west-1',
      capacity: 150,
      currentUsage: 25,
      version: '2.1.0-rc1',
      owner: 'DevOps Team',
      tags: ['staging', 'pre-prod', 'performance'],
      lastUpdated: '2024-01-15T08:45:00Z',
      booking: {
        id: 'booking-2',
        bookedBy: 'Mike Chen',
        purpose: 'Performance Testing Sprint',
        startDate: '2025-08-15',
        endDate: '2025-08-25',
        extendable: false,
        contact: 'mike.chen@company.com',
        notes: 'Load testing for Q3 release'
      },
      apis: [
        {
          id: 'api-5',
          name: 'Complete API Suite',
          url: 'https://staging-api.company.com/v1',
          method: 'GET',
          status: 'healthy',
          responseTime: 180,
          uptime: 99.7,
          lastChecked: '2024-01-15T10:20:00Z',
          authentication: 'bearer'
        }
      ]
    },
    {
      id: '4',
      name: 'Production Environment',
      type: 'production',
      status: 'maintenance',
      description: 'Live production environment serving customers',
      url: 'https://api.company.com',
      region: 'multi-region',
      capacity: 1000,
      currentUsage: 850,
      version: '2.0.8',
      owner: 'SRE Team',
      tags: ['production', 'critical', '24x7'],
      lastUpdated: '2024-01-15T11:00:00Z',
      apis: [
        {
          id: 'api-6',
          name: 'Production API',
          url: 'https://api.company.com/v1',
          method: 'GET',
          status: 'healthy',
          responseTime: 50,
          uptime: 99.99,
          lastChecked: '2024-01-15T10:30:00Z',
          authentication: 'bearer'
        }
      ]
    },
    {
      id: '5',
      name: 'Demo Environment',
      type: 'demo',
      status: 'booked',
      description: 'Client demonstration and sales environment',
      url: 'https://demo-api.company.com',
      region: 'us-central-1',
      capacity: 50,
      currentUsage: 30,
      version: '2.1.0-demo',
      owner: 'Sales Team',
      tags: ['demo', 'sales', 'showcase'],
      lastUpdated: '2024-01-15T09:15:00Z',
      booking: {
        id: 'booking-3',
        bookedBy: 'Lisa Rodriguez',
        purpose: 'Enterprise Client Demo',
        startDate: '2025-08-12',
        endDate: '2025-08-14',
        extendable: true,
        contact: 'lisa.rodriguez@company.com',
        notes: 'Major enterprise client presentation'
      },
      apis: [
        {
          id: 'api-7',
          name: 'Demo API',
          url: 'https://demo-api.company.com/v1',
          method: 'GET',
          status: 'healthy',
          responseTime: 100,
          uptime: 99.5,
          lastChecked: '2024-01-15T10:15:00Z',
          authentication: 'api_key'
        }
      ]
    }
  ];

  const loadEnvironmentsFromStorage = () => {
    try {
      const savedEnvironments = localStorage.getItem('environmentManagement_environments');
      if (savedEnvironments) {
        setEnvironments(JSON.parse(savedEnvironments));
      } else {
        const sampleEnvironments = initializeSampleEnvironments();
        setEnvironments(sampleEnvironments);
        localStorage.setItem('environmentManagement_environments', JSON.stringify(sampleEnvironments));
      }
    } catch (error) {
      console.error('Error loading environments from localStorage:', error);
      const sampleEnvironments = initializeSampleEnvironments();
      setEnvironments(sampleEnvironments);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('environmentManagement_environments');
    const sampleEnvironments = initializeSampleEnvironments();
    setEnvironments(sampleEnvironments);
    localStorage.setItem('environmentManagement_environments', JSON.stringify(sampleEnvironments));
  };  const getEnvironmentIcon = (type: Environment['type']) => {
    switch (type) {
      case 'development': return <ServerIcon />;
      case 'testing': return <ApiIcon />;
      case 'staging': return <CloudIcon />;
      case 'production': return <PublicIcon />;
      case 'demo': return <PublicIcon />;
      default: return <ServerIcon />;
    }
  };

  const getEnvironmentColor = (type: Environment['type']) => {
    switch (type) {
      case 'development': return '#4caf50';
      case 'testing': return '#ff9800';
      case 'staging': return '#2196f3';
      case 'production': return '#f44336';
      case 'demo': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: Environment['status']) => {
    switch (status) {
      case 'available': return <AvailableIcon color="success" />;
      case 'booked': return <LockedIcon color="warning" />;
      case 'maintenance': return <WarningIcon color="warning" />;
      case 'down': return <ErrorIcon color="error" />;
      default: return <AvailableIcon />;
    }
  };

  const getStatusColor = (status: Environment['status']) => {
    switch (status) {
      case 'available': return 'success';
      case 'booked': return 'warning';
      case 'maintenance': return 'info';
      case 'down': return 'error';
      default: return 'default';
    }
  };

  const getApiStatusColor = (status: ApiEndpoint['status']) => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'degraded': return '#ff9800';
      case 'down': return '#f44336';
      default: return '#757575';
    }
  };

  // Calendar utility functions
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date: Date, day: number) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const getBookingsForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const targetDate = new Date(year, month, day);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    return environments.filter(env => {
      if (!env.booking) return false;
      const startDate = new Date(env.booking.startDate);
      const endDate = new Date(env.booking.endDate);
      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDay = (day: number) => {
    const bookings = getBookingsForDay(day);
    const hasBookings = bookings.length > 0;
    const isCurrentDay = isToday(currentDate, day);

    return (
      <Box
        key={day}
        sx={{
          minHeight: 100,
          border: '1px solid #e0e0e0',
          p: 1,
          bgcolor: isCurrentDay ? 'primary.50' : 'white',
          position: 'relative',
          cursor: hasBookings ? 'pointer' : 'default',
          '&:hover': hasBookings ? { bgcolor: 'grey.50' } : {},
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: isCurrentDay ? 'bold' : 'normal',
            color: isCurrentDay ? 'primary.main' : 'text.primary',
          }}
        >
          {day}
        </Typography>
        
        {bookings.slice(0, 3).map((env, index) => (
          <Tooltip key={env.id} title={`${env.name} - ${env.booking?.bookedBy}`}>
            <Chip
              label={env.name}
              size="small"
              sx={{
                mt: 0.5,
                fontSize: '0.7rem',
                height: 20,
                bgcolor: getStatusColor(env.status) === 'warning' ? 'warning.light' : 'info.light',
                color: 'white',
                display: 'block',
                width: 'fit-content',
                maxWidth: '100%',
                '& .MuiChip-label': {
                  px: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              }}
            />
          </Tooltip>
        ))}
        
        {bookings.length > 3 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            +{bookings.length - 3} more
          </Typography>
        )}
      </Box>
    );
  };

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Create array for calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <Card>
        <CardContent>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => navigateMonth('prev')}>
              <PrevIcon />
            </IconButton>
            <Typography variant="h5" component="h2">
              {getMonthName(currentDate)}
            </Typography>
            <IconButton onClick={() => navigateMonth('next')}>
              <NextIcon />
            </IconButton>
          </Box>

          {/* Day headers */}
          <Grid container>
            {days.map(day => (
              <Grid item xs={12/7} key={day}>
                <Box sx={{ p: 1, textAlign: 'center', fontWeight: 'bold', bgcolor: 'grey.100' }}>
                  <Typography variant="body2" color="text.secondary">
                    {day}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar days */}
          <Grid container>
            {calendarDays.map((day, index) => (
              <Grid item xs={12/7} key={index}>
                {day ? renderCalendarDay(day) : (
                  <Box sx={{ minHeight: 100, border: '1px solid #e0e0e0', bgcolor: 'grey.50' }} />
                )}
              </Grid>
            ))}
          </Grid>

          {/* Legend */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'warning.light', borderRadius: 1 }} />
              <Typography variant="caption">Environment Booked</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: 'info.light', borderRadius: 1 }} />
              <Typography variant="caption">Available Environment</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const handleDeleteEnvironment = (environmentId: string) => {
    setEnvironments(environments.filter(env => env.id !== environmentId));
  };

  const handleDeleteApi = (environmentId: string, apiId: string) => {
    setEnvironments(environments.map(env => 
      env.id === environmentId 
        ? { ...env, apis: env.apis.filter(api => api.id !== apiId) }
        : env
    ));
  };

  const handleEditApi = (environmentId: string, api: ApiEndpoint) => {
    setApiForm({
      name: api.name,
      url: api.url,
      method: api.method,
      authentication: api.authentication,
      documentation: api.documentation || ''
    });
    setSelectedEnvironment(environmentId);
    setEditingApi(api);
    setApiDialogOpen(true);
  };

  const handleAddEnvironment = () => {
    setEnvironmentForm({
      name: '',
      type: 'development',
      description: '',
      url: '',
      region: '',
      capacity: 100,
      version: '',
      owner: '',
      tags: ''
    });
    setEditingEnvironment(null);
    setEnvironmentDialogOpen(true);
  };

  const handleEditEnvironment = (environment: Environment) => {
    setEnvironmentForm({
      name: environment.name,
      type: environment.type,
      description: environment.description,
      url: environment.url,
      region: environment.region,
      capacity: environment.capacity,
      version: environment.version,
      owner: environment.owner,
      tags: environment.tags.join(', ')
    });
    setEditingEnvironment(environment);
    setEnvironmentDialogOpen(true);
  };

  const handleBookEnvironment = (environmentId: string) => {
    setBookingForm({
      bookedBy: '',
      purpose: '',
      startDate: '',
      endDate: '',
      extendable: true,
      contact: '',
      notes: ''
    });
    setSelectedEnvironment(environmentId);
    setBookingDialogOpen(true);
  };

  const handleAddApi = (environmentId: string) => {
    setApiForm({
      name: '',
      url: '',
      method: 'GET',
      authentication: 'none',
      documentation: ''
    });
    setSelectedEnvironment(environmentId);
    setEditingApi(null);
    setApiDialogOpen(true);
  };

  const handleSaveEnvironment = () => {
    const newEnvironment: Environment = {
      id: editingEnvironment?.id || Date.now().toString(),
      ...environmentForm,
      tags: environmentForm.tags.split(',').map(s => s.trim()).filter(s => s),
      status: editingEnvironment?.status || 'available',
      currentUsage: editingEnvironment?.currentUsage || 0,
      apis: editingEnvironment?.apis || [],
      booking: editingEnvironment?.booking,
      lastUpdated: new Date().toISOString()
    };

    if (editingEnvironment) {
      setEnvironments(environments.map(e => e.id === editingEnvironment.id ? newEnvironment : e));
    } else {
      setEnvironments([...environments, newEnvironment]);
    }
    setEnvironmentDialogOpen(false);
  };

  const handleSaveBooking = () => {
    const booking: EnvironmentBooking = {
      id: Date.now().toString(),
      ...bookingForm
    };

    setEnvironments(environments.map(env => 
      env.id === selectedEnvironment 
        ? { ...env, status: 'booked' as Environment['status'], booking }
        : env
    ));
    setBookingDialogOpen(false);
  };

  const handleSaveApi = () => {
    const newApi: ApiEndpoint = {
      id: editingApi?.id || Date.now().toString(),
      ...apiForm,
      status: 'healthy',
      responseTime: 100,
      uptime: 99.9,
      lastChecked: new Date().toISOString()
    };

    setEnvironments(environments.map(env => 
      env.id === selectedEnvironment 
        ? { 
            ...env, 
            apis: editingApi 
              ? env.apis.map(api => api.id === editingApi.id ? newApi : api)
              : [...env.apis, newApi]
          }
        : env
    ));
    setApiDialogOpen(false);
  };

  const renderEnvironmentCard = (environment: Environment) => {
    const usagePercentage = (environment.currentUsage / environment.capacity) * 100;

    return (
      <Card key={environment.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: getEnvironmentColor(environment.type), mr: 2 }}>
                {getEnvironmentIcon(environment.type)}
              </Avatar>
              <Box>
                <Typography variant="h6">{environment.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {environment.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  {getStatusIcon(environment.status)}
                  <Chip 
                    label={environment.status} 
                    color={getStatusColor(environment.status) as any}
                    size="small"
                  />
                  <Chip label={environment.type} variant="outlined" size="small" />
                  <Chip label={`v${environment.version}`} variant="outlined" size="small" />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => handleEditEnvironment(environment)} title="Edit Environment">
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleDeleteEnvironment(environment.id)} 
                title="Delete Environment"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
              {environment.status === 'available' && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<BookingIcon />}
                  onClick={() => handleBookEnvironment(environment.id)}
                >
                  Book
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddApi(environment.id)}
              >
                Add API
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Environment Details</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><strong>URL:</strong> {environment.url}</Typography>
                <Typography variant="body2"><strong>Region:</strong> {environment.region}</Typography>
                <Typography variant="body2"><strong>Owner:</strong> {environment.owner}</Typography>
                <Typography variant="body2"><strong>Last Updated:</strong> {new Date(environment.lastUpdated).toLocaleString()}</Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>Usage</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Capacity Usage</Typography>
                  <Typography variant="body2">{environment.currentUsage}/{environment.capacity}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={usagePercentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Typography variant="subtitle2" gutterBottom>Tags</Typography>
              <Box>
                {environment.tags.map((tag, index) => (
                  <Chip key={index} label={tag} variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {environment.booking && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Current Booking</Typography>
                  <Alert severity="warning">
                    <Typography variant="body2"><strong>Booked by:</strong> {environment.booking.bookedBy}</Typography>
                    <Typography variant="body2"><strong>Purpose:</strong> {environment.booking.purpose}</Typography>
                    <Typography variant="body2"><strong>Duration:</strong> {environment.booking.startDate} to {environment.booking.endDate}</Typography>
                    <Typography variant="body2"><strong>Contact:</strong> {environment.booking.contact}</Typography>
                    {environment.booking.notes && (
                      <Typography variant="body2"><strong>Notes:</strong> {environment.booking.notes}</Typography>
                    )}
                  </Alert>
                </Box>
              )}

              <Typography variant="subtitle2" gutterBottom>
                API Endpoints ({environment.apis.length})
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>API Name</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Response Time</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {environment.apis.map((api) => (
                      <TableRow key={api.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{api.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {api.url}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={api.method} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: getApiStatusColor(api.status),
                                mr: 1
                              }}
                            />
                            <Typography variant="body2">{api.status}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{api.responseTime}ms</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {api.uptime}% uptime
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditApi(environment.id, api)}
                              title="Edit API"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteApi(environment.id, api.id)}
                              title="Delete API"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const totalEnvironments = environments.length;
  const availableEnvironments = environments.filter(e => e.status === 'available').length;
  const bookedEnvironments = environments.filter(e => e.status === 'booked').length;
  const totalApis = environments.reduce((sum, env) => sum + env.apis.length, 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Environment Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={handleResetData}
          >
            Reset Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddEnvironment}
          >
            Add Environment
          </Button>
        </Box>
      </Box>

      {/* Environment Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalEnvironments}
              </Typography>
              <Typography variant="subtitle1">Total Environments</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {availableEnvironments}
              </Typography>
              <Typography variant="subtitle1">Available</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {bookedEnvironments}
              </Typography>
              <Typography variant="subtitle1">Booked</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {totalApis}
              </Typography>
              <Typography variant="subtitle1">Total APIs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Mode Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={viewMode} 
          onChange={(_, newValue) => setViewMode(newValue)}
          aria-label="environment view modes"
        >
          <Tab 
            icon={<ListViewIcon />} 
            label="List View" 
            value="list"
            iconPosition="start"
          />
          <Tab 
            icon={<CalendarViewIcon />} 
            label="Calendar View" 
            value="calendar"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Content based on view mode */}
      {viewMode === 'list' ? (
        // Environments List
        <Box>
          {environments.map(environment => renderEnvironmentCard(environment))}
        </Box>
      ) : (
        // Calendar View
        <Box>
          <Typography variant="h6" gutterBottom>
            Environment Booking Calendar
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            View all environment bookings in calendar format to make better scheduling decisions.
          </Typography>
          {renderCalendarView()}
        </Box>
      )}

      {/* Environment Add/Edit Dialog */}
      <Dialog open={environmentDialogOpen} onClose={() => setEnvironmentDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEnvironment ? 'Edit Environment' : 'Add Environment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                label="Environment Name"
                fullWidth
                variant="outlined"
                value={environmentForm.name}
                onChange={(e) => setEnvironmentForm({...environmentForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Environment Type</InputLabel>
                <Select
                  value={environmentForm.type}
                  label="Environment Type"
                  onChange={(e) => setEnvironmentForm({...environmentForm, type: e.target.value as Environment['type']})}
                >
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="staging">Staging</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                  <MenuItem value="demo">Demo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={environmentForm.description}
                onChange={(e) => setEnvironmentForm({...environmentForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="URL"
                fullWidth
                variant="outlined"
                value={environmentForm.url}
                onChange={(e) => setEnvironmentForm({...environmentForm, url: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Region"
                fullWidth
                variant="outlined"
                value={environmentForm.region}
                onChange={(e) => setEnvironmentForm({...environmentForm, region: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Capacity"
                type="number"
                fullWidth
                variant="outlined"
                value={environmentForm.capacity}
                onChange={(e) => setEnvironmentForm({...environmentForm, capacity: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Version"
                fullWidth
                variant="outlined"
                value={environmentForm.version}
                onChange={(e) => setEnvironmentForm({...environmentForm, version: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Owner"
                fullWidth
                variant="outlined"
                value={environmentForm.owner}
                onChange={(e) => setEnvironmentForm({...environmentForm, owner: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tags (comma separated)"
                fullWidth
                variant="outlined"
                value={environmentForm.tags}
                onChange={(e) => setEnvironmentForm({...environmentForm, tags: e.target.value})}
                placeholder="nodejs, react, postgresql"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnvironmentDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEnvironment} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Environment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                label="Booked By"
                fullWidth
                variant="outlined"
                value={bookingForm.bookedBy}
                onChange={(e) => setBookingForm({...bookingForm, bookedBy: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contact Email"
                type="email"
                fullWidth
                variant="outlined"
                value={bookingForm.contact}
                onChange={(e) => setBookingForm({...bookingForm, contact: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Purpose"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={bookingForm.purpose}
                onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={bookingForm.startDate}
                onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                variant="outlined"
                value={bookingForm.endDate}
                onChange={(e) => setBookingForm({...bookingForm, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveBooking} variant="contained">Book Environment</Button>
        </DialogActions>
      </Dialog>

      {/* API Add/Edit Dialog */}
      <Dialog open={apiDialogOpen} onClose={() => setApiDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingApi ? 'Edit API Endpoint' : 'Add API Endpoint'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="API Name"
                fullWidth
                variant="outlined"
                value={apiForm.name}
                onChange={(e) => setApiForm({...apiForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="API URL"
                fullWidth
                variant="outlined"
                value={apiForm.url}
                onChange={(e) => setApiForm({...apiForm, url: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>HTTP Method</InputLabel>
                <Select
                  value={apiForm.method}
                  label="HTTP Method"
                  onChange={(e) => setApiForm({...apiForm, method: e.target.value as ApiEndpoint['method']})}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Authentication</InputLabel>
                <Select
                  value={apiForm.authentication}
                  label="Authentication"
                  onChange={(e) => setApiForm({...apiForm, authentication: e.target.value as ApiEndpoint['authentication']})}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="api_key">API Key</MenuItem>
                  <MenuItem value="oauth">OAuth</MenuItem>
                  <MenuItem value="bearer">Bearer Token</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Documentation URL"
                fullWidth
                variant="outlined"
                value={apiForm.documentation}
                onChange={(e) => setApiForm({...apiForm, documentation: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApiDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveApi} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnvironmentManagement;

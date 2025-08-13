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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Tab,
  Tabs,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Engineering as EngineeringIcon,
  BugReport as TestIcon,
  Analytics as AnalyticsIcon,
  Business as ProductIcon,
  Map as JourneyIcon,
  ExpandMore as ExpandMoreIcon,
  SupervisorAccount as LeaderIcon,
  Assignment as AssignmentIcon,
  Cloud as EnvironmentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import UserAutocomplete from './UserAutocomplete';

interface ChapterMember {
  id: string;
  name: string;
  email: string;
  title: string;
  skills: string[];
  experience: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  currentSquads: string[]; // Squad assignments
  isChapterLead: boolean;
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  type: 'product_owner' | 'engineering' | 'analyst' | 'journey_expert' | 'test' | 'environment';
  chapterLeads: ChapterMember[];
  members: ChapterMember[];
  establishedDate: string;
  objectives: string[];
  technologies?: string[]; // For technical chapters
  domains?: string[]; // For business chapters
}

const ChapterManagement: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingMember, setEditingMember] = useState<ChapterMember | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('');

  // Form states
  const [chapterForm, setChapterForm] = useState({
    name: '',
    description: '',
    type: 'engineering' as Chapter['type'],
    objectives: '',
    technologies: '',
    domains: '',
    establishedDate: ''
  });

  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    title: '',
    skills: '',
    experience: '',
    status: 'active' as ChapterMember['status'],
    joinDate: '',
    currentSquads: '',
    isChapterLead: false
  });

  // Mock data initialization
  useEffect(() => {
    loadChaptersFromStorage();
  }, []);

  // Auto-save to localStorage whenever chapters change
  useEffect(() => {
    if (chapters.length > 0) {
      localStorage.setItem('chapterManagement_chapters', JSON.stringify(chapters));
    }
  }, [chapters]);

  const initializeSampleChapters = (): Chapter[] => [
    {
        id: '1',
        name: 'Engineering Chapter',
        description: 'Responsible for technical architecture, development standards, and engineering best practices across all squads.',
        type: 'engineering',
        establishedDate: '2023-01-15',
        objectives: [
          'Maintain code quality standards',
          'Drive technical architecture decisions',
          'Share knowledge across teams',
          'Implement best practices',
          'Mentor junior developers'
        ],
        technologies: ['React', 'Node.js', 'TypeScript', 'Python', 'Java', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL'],
        chapterLeads: [
          {
            id: 'eng-lead-1',
            name: 'Sarah Thompson',
            email: 'sarah.thompson@company.com',
            title: 'Principal Engineer',
            skills: ['System Architecture', 'Team Leadership', 'React', 'Node.js', 'AWS'],
            experience: '8 years',
            status: 'active',
            joinDate: '2023-01-15',
            currentSquads: ['Alpha Squad', 'Architecture Review'],
            isChapterLead: true
          }
        ],
        members: [
          {
            id: 'eng-1',
            name: 'Alex Chen',
            email: 'alex.chen@company.com',
            title: 'Senior Software Engineer',
            skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
            experience: '4 years',
            status: 'active',
            joinDate: '2023-03-10',
            currentSquads: ['Alpha Squad'],
            isChapterLead: false
          },
          {
            id: 'eng-2',
            name: 'Maria Rodriguez',
            email: 'maria.rodriguez@company.com',
            title: 'Backend Engineer',
            skills: ['Python', 'PostgreSQL', 'Docker', 'Kubernetes'],
            experience: '6 years',
            status: 'active',
            joinDate: '2023-02-20',
            currentSquads: ['Alpha Squad', 'Beta Squad'],
            isChapterLead: false
          },
          {
            id: 'eng-3',
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            title: 'Full Stack Engineer',
            skills: ['Java', 'Spring Boot', 'React', 'Microservices'],
            experience: '5 years',
            status: 'active',
            joinDate: '2023-04-05',
            currentSquads: ['Beta Squad'],
            isChapterLead: false
          }
        ]
      },
      {
        id: '2',
        name: 'Product Owner Chapter',
        description: 'Drives product strategy, manages requirements, and ensures alignment between business goals and development efforts.',
        type: 'product_owner',
        establishedDate: '2023-01-15',
        objectives: [
          'Define product vision and strategy',
          'Manage product backlogs',
          'Stakeholder communication',
          'Market research and analysis',
          'Cross-squad coordination'
        ],
        domains: ['E-commerce', 'FinTech', 'User Experience', 'Market Analysis'],
        chapterLeads: [
          {
            id: 'po-lead-1',
            name: 'Michael Brown',
            email: 'michael.brown@company.com',
            title: 'Head of Product',
            skills: ['Product Strategy', 'Market Research', 'Stakeholder Management', 'Agile'],
            experience: '10 years',
            status: 'active',
            joinDate: '2023-01-15',
            currentSquads: ['Product Council'],
            isChapterLead: true
          }
        ],
        members: [
          {
            id: 'po-1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            title: 'Senior Product Owner',
            skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis'],
            experience: '5 years',
            status: 'active',
            joinDate: '2023-02-01',
            currentSquads: ['Alpha Squad'],
            isChapterLead: false
          },
          {
            id: 'po-2',
            name: 'James Wilson',
            email: 'james.wilson@company.com',
            title: 'Product Owner',
            skills: ['Requirements Management', 'User Stories', 'Stakeholder Communication'],
            experience: '3 years',
            status: 'active',
            joinDate: '2023-03-15',
            currentSquads: ['Beta Squad'],
            isChapterLead: false
          }
        ]
      },
      {
        id: '3',
        name: 'Test Chapter',
        description: 'Ensures quality standards, defines testing strategies, and implements testing frameworks across all squads.',
        type: 'test',
        establishedDate: '2023-01-20',
        objectives: [
          'Define testing standards',
          'Implement automation frameworks',
          'Quality assurance processes',
          'Performance testing strategies',
          'Security testing protocols'
        ],
        technologies: ['Selenium', 'Jest', 'Playwright', 'JMeter', 'Cypress', 'TestNG'],
        chapterLeads: [
          {
            id: 'test-lead-1',
            name: 'Jennifer Adams',
            email: 'jennifer.adams@company.com',
            title: 'QA Lead',
            skills: ['Test Strategy', 'Automation', 'Team Leadership', 'Quality Processes'],
            experience: '7 years',
            status: 'active',
            joinDate: '2023-01-20',
            currentSquads: ['Quality Council'],
            isChapterLead: true
          }
        ],
        members: [
          {
            id: 'test-1',
            name: 'David Kim',
            email: 'david.kim@company.com',
            title: 'Senior QA Engineer',
            skills: ['Automation Testing', 'Selenium', 'Jest', 'Playwright'],
            experience: '3 years',
            status: 'active',
            joinDate: '2023-02-10',
            currentSquads: ['Alpha Squad'],
            isChapterLead: false
          },
          {
            id: 'test-2',
            name: 'James Miller',
            email: 'james.miller@company.com',
            title: 'QA Engineer',
            skills: ['API Testing', 'Performance Testing', 'Security Testing'],
            experience: '4 years',
            status: 'active',
            joinDate: '2023-03-01',
            currentSquads: ['Beta Squad'],
            isChapterLead: false
          }
        ]
      },
      {
        id: '4',
        name: 'Analyst Chapter',
        description: 'Provides data insights, business intelligence, and analytical support across all squads and business units.',
        type: 'analyst',
        establishedDate: '2023-02-01',
        objectives: [
          'Data analysis and insights',
          'Business intelligence reporting',
          'Performance metrics tracking',
          'Predictive analytics',
          'Data visualization'
        ],
        technologies: ['SQL', 'Python', 'Tableau', 'Power BI', 'R', 'Apache Spark'],
        domains: ['Business Intelligence', 'Data Science', 'Performance Analytics'],
        chapterLeads: [
          {
            id: 'analyst-lead-1',
            name: 'Lisa Chen',
            email: 'lisa.chen@company.com',
            title: 'Senior Business Analyst',
            skills: ['Data Analysis', 'Business Intelligence', 'Team Leadership', 'Strategic Planning'],
            experience: '6 years',
            status: 'active',
            joinDate: '2023-02-01',
            currentSquads: ['Analytics Council'],
            isChapterLead: true
          }
        ],
        members: [
          {
            id: 'analyst-1',
            name: 'Robert Wilson',
            email: 'robert.wilson@company.com',
            title: 'Business Analyst',
            skills: ['Data Analysis', 'SQL', 'Tableau', 'Business Intelligence'],
            experience: '4 years',
            status: 'active',
            joinDate: '2023-02-15',
            currentSquads: ['Alpha Squad'],
            isChapterLead: false
          },
          {
            id: 'analyst-2',
            name: 'Amanda Garcia',
            email: 'amanda.garcia@company.com',
            title: 'Data Analyst',
            skills: ['Python', 'Statistics', 'Data Visualization', 'Machine Learning'],
            experience: '3 years',
            status: 'active',
            joinDate: '2023-04-10',
            currentSquads: ['Beta Squad'],
            isChapterLead: false
          }
        ]
      },
      {
        id: '5',
        name: 'Journey Expert Chapter',
        description: 'Focuses on user experience, customer journey optimization, and design thinking across all product initiatives.',
        type: 'journey_expert',
        establishedDate: '2023-02-15',
        objectives: [
          'User experience optimization',
          'Customer journey mapping',
          'Design thinking facilitation',
          'User research coordination',
          'Accessibility standards'
        ],
        domains: ['User Experience', 'Customer Journey', 'Design Systems', 'Accessibility'],
        chapterLeads: [
          {
            id: 'journey-lead-1',
            name: 'Sophie Martinez',
            email: 'sophie.martinez@company.com',
            title: 'Head of User Experience',
            skills: ['UX Strategy', 'Design Thinking', 'Team Leadership', 'Research Methods'],
            experience: '8 years',
            status: 'active',
            joinDate: '2023-02-15',
            currentSquads: ['UX Council'],
            isChapterLead: true
          }
        ],
        members: [
          {
            id: 'journey-1',
            name: 'Lisa Park',
            email: 'lisa.park@company.com',
            title: 'UX Designer',
            skills: ['User Journey Mapping', 'Customer Experience', 'Design Thinking', 'Prototyping'],
            experience: '5 years',
            status: 'active',
            joinDate: '2023-03-01',
            currentSquads: ['Alpha Squad'],
            isChapterLead: false
          },
          {
            id: 'journey-2',
            name: 'Kevin Chang',
            email: 'kevin.chang@company.com',
            title: 'Customer Experience Specialist',
            skills: ['Customer Research', 'Journey Optimization', 'Analytics', 'Usability Testing'],
            experience: '4 years',
            status: 'active',
            joinDate: '2023-03-20',
            currentSquads: ['Beta Squad'],
            isChapterLead: false
          }
        ]
      },
      {
        id: '6',
        name: 'Environment Chapter',
        description: 'Manages infrastructure, deployments, environment provisioning, and DevOps practices across all development stages.',
        type: 'environment',
        establishedDate: '2023-01-10',
        objectives: [
          'Infrastructure management',
          'Environment provisioning',
          'Deployment automation',
          'Monitoring and alerting',
          'DevOps best practices'
        ],
        technologies: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Prometheus', 'Grafana'],
        chapterLeads: [
          {
            id: 'env-lead-1',
            name: 'Mark Williams',
            email: 'mark.williams@company.com',
            title: 'DevOps Lead',
            skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Infrastructure as Code'],
            experience: '9 years',
            status: 'active',
            joinDate: '2023-01-10',
            currentSquads: ['Infrastructure Council'],
            isChapterLead: true
          }
        ],
        members: [
          {
            id: 'env-1',
            name: 'Jennifer Adams',
            email: 'jennifer.adams@company.com',
            title: 'Release Engineer',
            skills: ['CI/CD', 'DevOps', 'Release Management', 'GitOps'],
            experience: '7 years',
            status: 'active',
            joinDate: '2023-01-20',
            currentSquads: ['Alpha Squad', 'Beta Squad'],
            isChapterLead: false
          },
          {
            id: 'env-2',
            name: 'Carlos Rodriguez',
            email: 'carlos.rodriguez@company.com',
            title: 'Site Reliability Engineer',
            skills: ['Monitoring', 'Alerting', 'Performance Tuning', 'Incident Management'],
            experience: '5 years',
            status: 'active',
            joinDate: '2023-02-05',
            currentSquads: ['Production Support'],
            isChapterLead: false
          },
          {
            id: 'env-3',
            name: 'Anna Thompson',
            email: 'anna.thompson@company.com',
            title: 'Cloud Engineer',
            skills: ['AWS', 'Azure', 'Cloud Architecture', 'Terraform'],
            experience: '4 years',
            status: 'active',
            joinDate: '2023-03-10',
            currentSquads: ['Beta Squad'],
            isChapterLead: false
          }
        ]
      }
    ];

  const loadChaptersFromStorage = () => {
    try {
      const savedChapters = localStorage.getItem('chapterManagement_chapters');
      if (savedChapters) {
        setChapters(JSON.parse(savedChapters));
      } else {
        const sampleChapters = initializeSampleChapters();
        setChapters(sampleChapters);
        localStorage.setItem('chapterManagement_chapters', JSON.stringify(sampleChapters));
      }
    } catch (error) {
      console.error('Error loading chapters from localStorage:', error);
      const sampleChapters = initializeSampleChapters();
      setChapters(sampleChapters);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('chapterManagement_chapters');
    const sampleChapters = initializeSampleChapters();
    setChapters(sampleChapters);
    localStorage.setItem('chapterManagement_chapters', JSON.stringify(sampleChapters));
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
  };

  const handleDeleteMember = (chapterId: string, memberId: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId
        ? {
            ...chapter,
            members: chapter.members.filter(member => member.id !== memberId),
            chapterLeads: chapter.chapterLeads.filter(lead => lead.id !== memberId)
          }
        : chapter
    ));
  };

  const getChapterIcon = (type: Chapter['type']) => {
    switch (type) {
      case 'product_owner': return <ProductIcon />;
      case 'engineering': return <EngineeringIcon />;
      case 'test': return <TestIcon />;
      case 'analyst': return <AnalyticsIcon />;
      case 'journey_expert': return <JourneyIcon />;
      case 'environment': return <EnvironmentIcon />;
      default: return <GroupIcon />;
    }
  };

  const getChapterColor = (type: Chapter['type']) => {
    switch (type) {
      case 'product_owner': return '#2196f3';
      case 'engineering': return '#4caf50';
      case 'test': return '#ff9800';
      case 'analyst': return '#607d8b';
      case 'journey_expert': return '#e91e63';
      case 'environment': return '#9c27b0';
      default: return '#757575';
    }
  };

  const formatChapterType = (type: Chapter['type']) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };

  const handleAddChapter = () => {
    setChapterForm({
      name: '',
      description: '',
      type: 'engineering',
      objectives: '',
      technologies: '',
      domains: '',
      establishedDate: ''
    });
    setEditingChapter(null);
    setChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setChapterForm({
      name: chapter.name,
      description: chapter.description,
      type: chapter.type,
      objectives: chapter.objectives.join(', '),
      technologies: chapter.technologies?.join(', ') || '',
      domains: chapter.domains?.join(', ') || '',
      establishedDate: chapter.establishedDate
    });
    setEditingChapter(chapter);
    setChapterDialogOpen(true);
  };

  const handleAddMember = (chapterId: string) => {
    setMemberForm({
      name: '',
      email: '',
      title: '',
      skills: '',
      experience: '',
      status: 'active',
      joinDate: '',
      currentSquads: '',
      isChapterLead: false
    });
    setSelectedChapter(chapterId);
    setEditingMember(null);
    setMemberDialogOpen(true);
  };

  const handleEditMember = (member: ChapterMember, chapterId: string) => {
    setMemberForm({
      name: member.name,
      email: member.email,
      title: member.title,
      skills: member.skills.join(', '),
      experience: member.experience,
      status: member.status,
      joinDate: member.joinDate,
      currentSquads: member.currentSquads.join(', '),
      isChapterLead: member.isChapterLead
    });
    setSelectedChapter(chapterId);
    setEditingMember(member);
    setMemberDialogOpen(true);
  };

  const handleSaveChapter = () => {
    const newChapter: Chapter = {
      id: editingChapter?.id || Date.now().toString(),
      name: chapterForm.name,
      description: chapterForm.description,
      type: chapterForm.type,
      establishedDate: chapterForm.establishedDate,
      objectives: chapterForm.objectives.split(',').map(s => s.trim()).filter(s => s),
      technologies: chapterForm.technologies ? chapterForm.technologies.split(',').map(s => s.trim()).filter(s => s) : undefined,
      domains: chapterForm.domains ? chapterForm.domains.split(',').map(s => s.trim()).filter(s => s) : undefined,
      chapterLeads: editingChapter?.chapterLeads || [],
      members: editingChapter?.members || []
    };

    if (editingChapter) {
      setChapters(chapters.map(c => c.id === editingChapter.id ? newChapter : c));
    } else {
      setChapters([...chapters, newChapter]);
    }
    setChapterDialogOpen(false);
  };

  const handleSaveMember = () => {
    const newMember: ChapterMember = {
      id: editingMember?.id || Date.now().toString(),
      name: memberForm.name,
      email: memberForm.email,
      title: memberForm.title,
      skills: memberForm.skills.split(',').map(s => s.trim()).filter(s => s),
      experience: memberForm.experience,
      status: memberForm.status,
      joinDate: memberForm.joinDate,
      currentSquads: memberForm.currentSquads.split(',').map(s => s.trim()).filter(s => s),
      isChapterLead: memberForm.isChapterLead
    };

    setChapters(chapters.map(chapter => {
      if (chapter.id !== selectedChapter) return chapter;

      const updatedChapter = { ...chapter };
      
      // Remove member from old position if editing
      if (editingMember) {
        updatedChapter.chapterLeads = updatedChapter.chapterLeads.filter(m => m.id !== editingMember.id);
        updatedChapter.members = updatedChapter.members.filter(m => m.id !== editingMember.id);
      }

      // Add member to correct position
      if (newMember.isChapterLead) {
        updatedChapter.chapterLeads.push(newMember);
      } else {
        updatedChapter.members.push(newMember);
      }

      return updatedChapter;
    }));

    setMemberDialogOpen(false);
  };

  const renderMemberCard = (member: ChapterMember, chapterId: string) => (
    <Card key={member.id} sx={{ mb: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar sx={{ bgcolor: member.isChapterLead ? '#1976d2' : '#757575', mr: 2 }}>
              {member.isChapterLead ? <LeaderIcon /> : <PersonIcon />}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2">{member.name}</Typography>
                {member.isChapterLead && (
                  <Chip label="Chapter Lead" size="small" color="primary" />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {member.title} • {member.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip 
                  label={member.status} 
                  size="small" 
                  color={getStatusColor(member.status) as any}
                  sx={{ mr: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Experience: {member.experience}
                </Typography>
              </Box>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Current Squads: {member.currentSquads.join(', ') || 'None'}
                </Typography>
              </Box>
              <Box sx={{ mt: 0.5 }}>
                {member.skills.slice(0, 3).map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
                {member.skills.length > 3 && (
                  <Chip label={`+${member.skills.length - 3} more`} variant="outlined" size="small" />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={() => handleEditMember(member, chapterId)}
            title="Edit Member"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => handleDeleteMember(chapterId, member.id)}
            title="Delete Member"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  const renderChapterCard = (chapter: Chapter) => {
    const totalMembers = chapter.chapterLeads.length + chapter.members.length;
    const activeMembers = [...chapter.chapterLeads, ...chapter.members].filter(m => m.status === 'active').length;

    return (
      <Accordion key={chapter.id} sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Avatar sx={{ bgcolor: getChapterColor(chapter.type), mr: 2 }}>
              {getChapterIcon(chapter.type)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{chapter.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatChapterType(chapter.type)} • {totalMembers} members ({activeMembers} active)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                icon={<LeaderIcon />}
                label={`${chapter.chapterLeads.length} Lead${chapter.chapterLeads.length !== 1 ? 's' : ''}`} 
                size="small" 
                color="primary"
              />
              <Chip 
                icon={<GroupIcon />}
                label={`${chapter.members.length} Member${chapter.members.length !== 1 ? 's' : ''}`} 
                size="small" 
                variant="outlined"
              />
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {chapter.description}
                </Typography>
                <Box>
                  <IconButton onClick={() => handleEditChapter(chapter)} title="Edit Chapter">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteChapter(chapter.id)} 
                    title="Delete Chapter"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AddIcon />}
                    onClick={() => handleAddMember(chapter.id)}
                    sx={{ ml: 1 }}
                  >
                    Add Member
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Chapter Objectives */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>Objectives</Typography>
              <Box>
                {chapter.objectives.map((objective, index) => (
                  <Chip key={index} label={objective} variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>

            {/* Technologies or Domains */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                {chapter.technologies ? 'Technologies' : 'Domains'}
              </Typography>
              <Box>
                {(chapter.technologies || chapter.domains || []).map((item, index) => (
                  <Chip key={index} label={item} color="primary" variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>

            {/* Chapter Stats */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>Chapter Stats</Typography>
              <Box>
                <Typography variant="body2">Established: {new Date(chapter.establishedDate).toLocaleDateString()}</Typography>
                <Typography variant="body2">Total Members: {totalMembers}</Typography>
                <Typography variant="body2">Active Members: {activeMembers}</Typography>
              </Box>
            </Grid>

            {/* Chapter Leads */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Chapter Leads ({chapter.chapterLeads.length})
              </Typography>
              {chapter.chapterLeads.length > 0 ? 
                chapter.chapterLeads.map(lead => renderMemberCard(lead, chapter.id)) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Chapter Leads assigned</Typography>
                </Box>
              }
            </Grid>

            {/* Chapter Members */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Chapter Members ({chapter.members.length})
              </Typography>
              {chapter.members.length > 0 ? 
                chapter.members.map(member => renderMemberCard(member, chapter.id)) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Chapter Members assigned</Typography>
                </Box>
              }
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const totalMembers = chapters.reduce((total, chapter) => 
    total + chapter.chapterLeads.length + chapter.members.length, 0
  );

  const totalLeads = chapters.reduce((total, chapter) => 
    total + chapter.chapterLeads.length, 0
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Chapter Management
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
            onClick={handleAddChapter}
          >
            Add Chapter
          </Button>
        </Box>
      </Box>

      {/* Chapter Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {chapters.length}
              </Typography>
              <Typography variant="subtitle1">Total Chapters</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {totalLeads}
              </Typography>
              <Typography variant="subtitle1">Chapter Leads</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {totalMembers}
              </Typography>
              <Typography variant="subtitle1">Total Members</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {chapters.reduce((total, chapter) => {
                  const squadAssignments = [...chapter.chapterLeads, ...chapter.members]
                    .flatMap(member => member.currentSquads);
                  return total + squadAssignments.length;
                }, 0)}
              </Typography>
              <Typography variant="subtitle1">Squad Assignments</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chapters List */}
      {chapters.map(chapter => renderChapterCard(chapter))}

      {/* Chapter Add/Edit Dialog */}
      <Dialog open={chapterDialogOpen} onClose={() => setChapterDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingChapter ? 'Edit Chapter' : 'Add Chapter'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                label="Chapter Name"
                fullWidth
                variant="outlined"
                value={chapterForm.name}
                onChange={(e) => setChapterForm({...chapterForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Chapter Type</InputLabel>
                <Select
                  value={chapterForm.type}
                  label="Chapter Type"
                  onChange={(e) => setChapterForm({...chapterForm, type: e.target.value as Chapter['type']})}
                >
                  <MenuItem value="product_owner">Product Owner</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="test">Test</MenuItem>
                  <MenuItem value="analyst">Analyst</MenuItem>
                  <MenuItem value="journey_expert">Journey Expert</MenuItem>
                  <MenuItem value="environment">Environment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={chapterForm.description}
                onChange={(e) => setChapterForm({...chapterForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Objectives (comma separated)"
                fullWidth
                variant="outlined"
                value={chapterForm.objectives}
                onChange={(e) => setChapterForm({...chapterForm, objectives: e.target.value})}
                placeholder="Define standards, Share knowledge, Mentor team members"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Technologies (comma separated)"
                fullWidth
                variant="outlined"
                value={chapterForm.technologies}
                onChange={(e) => setChapterForm({...chapterForm, technologies: e.target.value})}
                placeholder="React, Node.js, Python, AWS"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Domains (comma separated)"
                fullWidth
                variant="outlined"
                value={chapterForm.domains}
                onChange={(e) => setChapterForm({...chapterForm, domains: e.target.value})}
                placeholder="E-commerce, FinTech, User Experience"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Established Date"
                type="date"
                fullWidth
                variant="outlined"
                value={chapterForm.establishedDate}
                onChange={(e) => setChapterForm({...chapterForm, establishedDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChapterDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveChapter} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Member Add/Edit Dialog */}
      <Dialog open={memberDialogOpen} onClose={() => setMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Member' : 'Add Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                label="Name"
                fullWidth
                variant="outlined"
                value={memberForm.name}
                onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={memberForm.email}
                onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                fullWidth
                variant="outlined"
                value={memberForm.title}
                onChange={(e) => setMemberForm({...memberForm, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={memberForm.status}
                  label="Status"
                  onChange={(e) => setMemberForm({...memberForm, status: e.target.value as ChapterMember['status']})}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma separated)"
                fullWidth
                variant="outlined"
                value={memberForm.skills}
                onChange={(e) => setMemberForm({...memberForm, skills: e.target.value})}
                placeholder="React, Node.js, TypeScript, AWS"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience"
                fullWidth
                variant="outlined"
                value={memberForm.experience}
                onChange={(e) => setMemberForm({...memberForm, experience: e.target.value})}
                placeholder="e.g. 5 years"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Join Date"
                type="date"
                fullWidth
                variant="outlined"
                value={memberForm.joinDate}
                onChange={(e) => setMemberForm({...memberForm, joinDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Current Squads (comma separated)"
                fullWidth
                variant="outlined"
                value={memberForm.currentSquads}
                onChange={(e) => setMemberForm({...memberForm, currentSquads: e.target.value})}
                placeholder="Alpha Squad, Beta Squad"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role in Chapter</InputLabel>
                <Select
                  value={memberForm.isChapterLead ? 'lead' : 'member'}
                  label="Role in Chapter"
                  onChange={(e) => setMemberForm({...memberForm, isChapterLead: e.target.value === 'lead'})}
                >
                  <MenuItem value="member">Chapter Member</MenuItem>
                  <MenuItem value="lead">Chapter Lead</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMember} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChapterManagement;

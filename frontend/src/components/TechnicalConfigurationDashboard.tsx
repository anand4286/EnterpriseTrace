import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
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
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Avatar,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Web as FrontendIcon,
  CloudQueue as BackendIcon,
  Cloud as CloudIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface TechStackItem {
  id: string;
  name: string;
  description?: string;
  version?: string;
  category: string;
  parentId?: string;
  status: 'Active' | 'Deprecated' | 'Development' | 'Planned';
  healthStatus: 'Healthy' | 'Warning' | 'Critical' | 'Unknown';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TechStackCategory {
  id: string;
  name: string;
  description?: string;
  icon: React.ReactNode;
  children: TechStackItem[];
}

const TechnicalConfigurationDashboard: React.FC = () => {
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [categories, setCategories] = useState<TechStackCategory[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStackItem | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '',
    category: '',
    parentId: '',
    status: 'Active' as TechStackItem['status'],
    healthStatus: 'Healthy' as TechStackItem['healthStatus'],
    tags: [] as string[],
  });
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Initialize with sample data and load from localStorage
  useEffect(() => {
    // Try to load data from localStorage first
    const savedCategories = localStorage.getItem('techStackCategories');
    const savedTechStack = localStorage.getItem('techStackItems');

    if (savedCategories && savedTechStack) {
      // Load from localStorage
      try {
        const parsedCategories = JSON.parse(savedCategories);
        const parsedTechStack = JSON.parse(savedTechStack);
        
        // Restore React icons for categories
        const categoriesWithIcons = parsedCategories.map((cat: any) => ({
          ...cat,
          icon: getIconForCategory(cat.name)
        }));
        
        setCategories(categoriesWithIcons);
        setTechStack(parsedTechStack);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Fall back to sample data if parsing fails
        initializeSampleData();
      }
    } else {
      // Initialize with sample data on first visit
      initializeSampleData();
    }
  }, []);

  // Helper function to get appropriate icon for category
  const getIconForCategory = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'frontend': return <FrontendIcon />;
      case 'backend': return <BackendIcon />;
      case 'database': return <DatabaseIcon />;
      case 'devops': return <CloudIcon />;
      default: return <CategoryIcon />;
    }
  };

  // Initialize sample data
  const initializeSampleData = () => {
    const sampleCategories: TechStackCategory[] = [
      {
        id: '1',
        name: 'Frontend',
        description: 'Client-side technologies',
        icon: <FrontendIcon />,
        children: []
      },
      {
        id: '2',
        name: 'Backend',
        description: 'Server-side technologies',
        icon: <BackendIcon />,
        children: []
      },
      {
        id: '3',
        name: 'Database',
        description: 'Data storage solutions',
        icon: <DatabaseIcon />,
        children: []
      },
      {
        id: '4',
        name: 'DevOps',
        description: 'Development and operations tools',
        icon: <CloudIcon />,
        children: []
      }
    ];

    const sampleTechStack: TechStackItem[] = [
      {
        id: '1',
        name: 'React',
        description: 'JavaScript library for building user interfaces',
        version: '18.2.0',
        category: '1',
        status: 'Active',
        healthStatus: 'Healthy',
        tags: ['JavaScript', 'UI', 'SPA'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Material-UI',
        description: 'React UI framework',
        version: '5.14.5',
        category: '1',
        parentId: '1',
        status: 'Active',
        healthStatus: 'Healthy',
        tags: ['React', 'Components', 'Design'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Node.js',
        description: 'JavaScript runtime built on Chrome V8 engine',
        version: '18.17.0',
        category: '2',
        status: 'Active',
        healthStatus: 'Healthy',
        tags: ['JavaScript', 'Runtime', 'Server'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Express.js',
        description: 'Fast, unopinionated, minimalist web framework',
        version: '4.18.2',
        category: '2',
        parentId: '3',
        status: 'Active',
        healthStatus: 'Healthy',
        tags: ['Node.js', 'Framework', 'API'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'PostgreSQL',
        description: 'Advanced open source relational database',
        version: '15.3',
        category: '3',
        status: 'Active',
        healthStatus: 'Healthy',
        tags: ['SQL', 'Relational', 'ACID'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setCategories(sampleCategories);
    setTechStack(sampleTechStack);
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (categories.length > 0) {
      // Save categories without icons (since they can't be serialized)
      const categoriesToSave = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        children: cat.children
      }));
      localStorage.setItem('techStackCategories', JSON.stringify(categoriesToSave));
    }
  }, [categories]);

  useEffect(() => {
    if (techStack.length > 0) {
      localStorage.setItem('techStackItems', JSON.stringify(techStack));
    }
  }, [techStack]);

  // Update categories with children
  useEffect(() => {
    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        children: techStack.filter(item => item.category === category.id && !item.parentId)
      }))
    );
  }, [techStack]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Development': return 'warning';
      case 'Deprecated': return 'error';
      case 'Planned': return 'info';
      default: return 'default';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'success';
      case 'Warning': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  const getChildItems = (parentId: string) => {
    return techStack.filter(item => item.parentId === parentId);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      version: '',
      category: '',
      parentId: '',
      status: 'Active',
      healthStatus: 'Healthy',
      tags: [],
    });
    setOpenDialog(true);
  };

  const handleEditItem = (item: TechStackItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      version: item.version || '',
      category: item.category,
      parentId: item.parentId || '',
      status: item.status,
      healthStatus: item.healthStatus,
      tags: item.tags,
    });
    setOpenDialog(true);
  };

  const handleDeleteItem = (id: string) => {
    // Also delete child items
    setTechStack(prev => prev.filter(item => item.id !== id && item.parentId !== id));
    setSnackbar({ open: true, message: 'Tech stack item deleted successfully', severity: 'success' });
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.category) {
      setSnackbar({ open: true, message: 'Name and category are required', severity: 'error' });
      return;
    }

    const now = new Date().toISOString();
    
    if (editingItem) {
      // Update existing item
      setTechStack(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, updatedAt: now }
          : item
      ));
      setSnackbar({ open: true, message: 'Tech stack item updated successfully', severity: 'success' });
    } else {
      // Add new item
      const newItem: TechStackItem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      setTechStack(prev => [...prev, newItem]);
      setSnackbar({ open: true, message: 'Tech stack item added successfully', severity: 'success' });
    }
    
    setOpenDialog(false);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    
    const newCategory: TechStackCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      description: newCategoryDescription,
      icon: <CategoryIcon />,
      children: []
    };
    
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryDescription('');
    setOpenCategoryDialog(false);
    setSnackbar({ open: true, message: 'Category added successfully', severity: 'success' });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setTechStack(prev => prev.filter(item => item.category !== categoryId));
    setSnackbar({ open: true, message: 'Category and its items deleted successfully', severity: 'success' });
  };

  const handleResetData = () => {
    // Clear localStorage
    localStorage.removeItem('techStackCategories');
    localStorage.removeItem('techStackItems');
    
    // Reset to sample data
    initializeSampleData();
    setSnackbar({ open: true, message: 'Data reset to defaults successfully', severity: 'success' });
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderTechStackItem = (item: TechStackItem, isChild = false) => {
    const childItems = getChildItems(item.id);
    
    return (
      <Card 
        key={item.id} 
        sx={{ 
          mb: 1, 
          ml: isChild ? 2 : 0,
          border: isChild ? '1px dashed #ddd' : 'none'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                {item.name} {item.version && <Chip label={item.version} size="small" sx={{ ml: 1 }} />}
              </Typography>
              {item.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Chip 
                  label={item.status} 
                  size="small" 
                  color={getStatusColor(item.status) as any}
                />
                <Chip 
                  label={item.healthStatus} 
                  size="small" 
                  color={getHealthColor(item.healthStatus) as any}
                />
                {item.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
            <Box>
              <IconButton onClick={() => handleEditItem(item)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteItem(item.id)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          
          {childItems.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Dependencies:
              </Typography>
              {childItems.map(child => renderTechStackItem(child, true))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tech Stack Dashboard
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
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenCategoryDialog(true)}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
          >
            Add Tech Stack Item
          </Button>
        </Box>
      </Box>

      {/* Categories and Tech Stack Items */}
      <Grid container spacing={3}>
        {categories.map(category => (
          <Grid item xs={12} md={6} lg={4} key={category.id}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {category.icon}
                  </Avatar>
                }
                title={category.name}
                subheader={category.description}
                action={
                  <IconButton onClick={() => handleDeleteCategory(category.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                }
              />
              <CardContent>
                {category.children.length > 0 ? (
                  category.children.map(item => renderTechStackItem(item))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No items in this category
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.id }));
                    handleAddItem();
                  }}
                  sx={{ mt: 2 }}
                >
                  Add to {category.name}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Tech Stack Item' : 'Add Tech Stack Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Version"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Parent Item</InputLabel>
              <Select
                value={formData.parentId}
                onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                label="Parent Item"
              >
                <MenuItem value="">None (Root Level)</MenuItem>
                {techStack
                  .filter(item => item.category === formData.category && !item.parentId)
                  .map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TechStackItem['status'] }))}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Deprecated">Deprecated</MenuItem>
                <MenuItem value="Planned">Planned</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Health Status</InputLabel>
              <Select
                value={formData.healthStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value as TechStackItem['healthStatus'] }))}
                label="Health Status"
              >
                <MenuItem value="Healthy">Healthy</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Add Tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  size="small"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} variant="outlined" size="small">
                  Add
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSaveItem} variant="contained" startIcon={<SaveIcon />}>
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">Add Category</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TechnicalConfigurationDashboard;

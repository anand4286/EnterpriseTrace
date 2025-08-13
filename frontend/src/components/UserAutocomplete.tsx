import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Avatar,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { apiCall } from '../utils/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: {
    id: string;
    name: string;
    level: 'executive' | 'manager' | 'lead' | 'member' | 'viewer';
    permissions: string[];
  };
  profile: {
    avatar?: string;
    phone?: string;
    location: string;
    department: string;
    jobTitle: string;
    skills: string[];
    certifications: string[];
  };
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: Date;
  createdAt: Date;
}

interface UserAutocompleteProps {
  value?: User | null;
  onChange?: (user: User | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  multipleValue?: User[];
  onMultipleChange?: (users: User[]) => void;
  filterByStatus?: ('active' | 'inactive' | 'pending')[];
  filterByRole?: string[];
  helperText?: string;
  error?: boolean;
}

const UserAutocomplete: React.FC<UserAutocompleteProps> = ({
  value,
  onChange,
  label = 'Select User',
  placeholder = 'Type to search users...',
  required = false,
  disabled = false,
  multiple = false,
  multipleValue = [],
  onMultipleChange,
  filterByStatus = ['active'],
  filterByRole,
  helperText,
  error
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('UserAutocomplete: Loading users from API...');
      const response = await apiCall('/api/users');
      console.log('UserAutocomplete: API response:', response);
      
      let filteredUsers = response.users || [];
      console.log('UserAutocomplete: Raw users:', filteredUsers);

      // Filter by status if specified
      if (filterByStatus.length > 0) {
        filteredUsers = filteredUsers.filter((user: User) => 
          filterByStatus.includes(user.status)
        );
        console.log('UserAutocomplete: After status filter:', filteredUsers);
      }

      // Filter by role if specified
      if (filterByRole && filterByRole.length > 0) {
        filteredUsers = filteredUsers.filter((user: User) => 
          filterByRole.includes(user.role.name)
        );
        console.log('UserAutocomplete: After role filter:', filteredUsers);
      }

      setUsers(filteredUsers);
      console.log('UserAutocomplete: Final users set:', filteredUsers);
    } catch (error) {
      console.error('UserAutocomplete: Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filterByStatus, filterByRole]);

  // Format user display name
  const getUserDisplayName = (user: User) => {
    return `${user.firstName} ${user.lastName}`;
  };

  // Format user subtitle
  const getUserSubtitle = (user: User) => {
    return `${user.profile.jobTitle} • ${user.profile.department}`;
  };

  if (multiple) {
    return (
      <Autocomplete
        multiple
        value={multipleValue}
        onChange={(event, newValue) => {
          onMultipleChange?.(newValue as User[]);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={users}
        getOptionLabel={(option) => getUserDisplayName(option)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={loading}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            helperText={helperText}
            error={error}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Avatar
              src={option.profile.avatar}
              sx={{ width: 32, height: 32, mr: 2 }}
            >
              {option.firstName[0]}{option.lastName[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {getUserDisplayName(option)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getUserSubtitle(option)}
              </Typography>
            </Box>
            <Chip
              label={option.role.name}
              size="small"
              color={option.status === 'active' ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              avatar={
                <Avatar src={option.profile.avatar} sx={{ width: 24, height: 24 }}>
                  {option.firstName[0]}{option.lastName[0]}
                </Avatar>
              }
              label={getUserDisplayName(option)}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
      />
    );
  }

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange?.(newValue as User | null);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={users}
      getOptionLabel={(option) => getUserDisplayName(option)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          helperText={helperText}
          error={error}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
          <Avatar
            src={option.profile.avatar}
            sx={{ width: 32, height: 32, mr: 2 }}
          >
            {option.firstName[0]}{option.lastName[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {getUserDisplayName(option)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getUserSubtitle(option)}
            </Typography>
          </Box>
          <Chip
            label={option.role.name}
            size="small"
            color={option.status === 'active' ? 'success' : 'default'}
            variant="outlined"
          />
        </Box>
      )}
    />
  );
};

export default UserAutocomplete;

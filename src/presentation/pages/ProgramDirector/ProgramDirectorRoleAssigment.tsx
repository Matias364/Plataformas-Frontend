import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Chip,
  Avatar,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Datos de prueba para los usuarios
const usersData = [
  {
    id: 'USR001',
    name: 'Roberto Mendez',
    email: 'roberto.mendez@universidad.edu',
    role: 'Coordinador de Asignatura',
    roleColor: '#4caf50',
    subjects: ['ENF-301', 'ENF-205'],
    status: 'Activo',
    statusColor: '#4caf50',
    avatar: null
  },
  {
    id: 'USR002',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@universidad.edu',
    role: 'Coordinador ECOE',
    roleColor: '#ff9800',
    subjects: ['No aplica'],
    status: 'Activo',
    statusColor: '#4caf50',
    avatar: null
  },
  {
    id: 'USR003',
    name: 'Juan Perez',
    email: 'juan.perez@universidad.edu',
    role: 'Coordinador de Asignatura',
    roleColor: '#4caf50',
    subjects: ['ENF-102', 'ENF-405'],
    status: 'Activo',
    statusColor: '#4caf50',
    avatar: null
  },
  {
    id: 'USR004',
    name: 'Ana Lopez',
    email: 'ana.lopez@universidad.edu',
    role: 'Coordinador de Asignatura',
    roleColor: '#4caf50',
    subjects: ['ENF-203'],
    status: 'Inactivo',
    statusColor: '#f44336',
    avatar: null
  },
  {
    id: 'USR005',
    name: 'Carlos Gomez',
    email: 'carlos.gomez@universidad.edu',
    role: 'Jefatura de Carrera',
    roleColor: '#2196f3',
    subjects: ['No aplica'],
    status: 'Activo',
    statusColor: '#4caf50',
    avatar: null
  }
];

const ProgramDirectorRoleAssigment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos los roles');
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [tabValue, setTabValue] = useState(0);

  // Función para filtrar usuarios
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    let filtered = usersData.filter(user =>
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.id.toLowerCase().includes(value)
    );

    // Aplicar filtro de rol si no es "Todos los roles"
    if (selectedRole !== 'Todos los roles') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  // Función para manejar el cambio de rol
  const handleRoleChange = (event: any) => {
    const role = event.target.value;
    setSelectedRole(role);
    
    let filtered = usersData;
    
    // Aplicar filtro de búsqueda si hay texto
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de rol si no es "Todos los roles"
    if (role !== 'Todos los roles') {
      filtered = filtered.filter(user => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  // Función para cambiar tabs
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Función para cambiar rol de usuario
  const handleChangeRole = (userId: string) => {
    console.log('Cambiar rol del usuario:', userId);
    // Aquí iría la lógica para cambiar el rol del usuario
  };

  // Función para agregar usuario
  const handleAddUser = () => {
    console.log('Agregar usuario');
    // Aquí iría la lógica para agregar un nuevo usuario
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" component="h1" fontWeight={700} color="#333">
          Asignacion de Roles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          sx={{
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#45a049'
            },
            textTransform: 'none'
          }}
        >
          Agregar Usuario
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Usuarios" 
            sx={{ 
              textTransform: 'none',
              fontWeight: tabValue === 0 ? 600 : 400
            }} 
          />
          <Tab 
            label="Asignaturas" 
            sx={{ 
              textTransform: 'none',
              fontWeight: tabValue === 1 ? 600 : 400
            }} 
          />
        </Tabs>
      </Box>

      {/* Panel de Usuarios */}
      <TabPanel value={tabValue} index={0}>
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3 
            }}>
              <Box>
                <Typography variant="h6" component="h2" fontWeight={600} color="#333">
                  Gestión de Usuarios y Roles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asigne roles y permisos a los usuarios del sistema
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={handleSearch}
                  variant="outlined"
                  size="small"
                  sx={{ width: 250 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filtrar por rol</InputLabel>
                  <Select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    label="Filtrar por rol"
                    size="small"
                  >
                    <MenuItem value="Todos los roles">Todos los roles</MenuItem>
                    <MenuItem value="Jefatura de Carrera">Jefatura de Carrera</MenuItem>
                    <MenuItem value="Coordinador de Asignatura">Coordinador de Asignatura</MenuItem>
                    <MenuItem value="Coordinador ECOE">Coordinador ECOE</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Tabla de Usuarios */}
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Asignaturas</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              backgroundColor: '#1976d2',
                              fontSize: '0.875rem'
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500} color="#333">
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#666' }}>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role}
                          size="small"
                          sx={{
                            backgroundColor: user.roleColor,
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {user.subjects.map((subject, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{ 
                                color: subject === 'No aplica' ? '#999' : '#333',
                                fontStyle: subject === 'No aplica' ? 'italic' : 'normal'
                              }}
                            >
                              {subject}
                              {index < user.subjects.length - 1 && subject !== 'No aplica' ? ', ' : ''}
                            </Typography>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status}
                          size="small"
                          sx={{
                            backgroundColor: user.statusColor,
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleChangeRole(user.id)}
                          sx={{
                            backgroundColor: '#ff9800',
                            '&:hover': {
                              backgroundColor: '#f57c00'
                            },
                            textTransform: 'none'
                          }}
                        >
                          Cambiar Rol
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Panel de Asignaturas */}
      <TabPanel value={tabValue} index={1}>
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" component="h2" fontWeight={600} color="#333" sx={{ mb: 2 }}>
              Gestión de Asignaturas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Funcionalidad de gestión de asignaturas - En desarrollo
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
};

export default ProgramDirectorRoleAssigment;

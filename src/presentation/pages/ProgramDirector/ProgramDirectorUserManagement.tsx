import React, { useState, useEffect } from 'react';
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
  Tabs,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
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

interface User {
  id: string;
  email: string;
  fullname: string;
  role: string;
}

interface UserTableData {
  id: string;
  name: string;
  email: string;
  role: string;
  roleColor: string;
  subjects: string[];
  status: string;
  statusColor: string;
  avatar: null;
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

// Función para mapear roles de la API a nombres en español
const mapRoleToDisplayName = (role: string) => {
  const roleMap: { [key: string]: string } = {
    'docente_ecoe': 'Coordinador ECOE',
    'docente_asignatura': 'Coordinador de Asignatura',
    'estudiante': 'Estudiante',
    'jefatura': 'Jefatura de Carrera'
  };
  return roleMap[role] || role;
};

// Función para obtener el color del rol
const getRoleColor = (role: string) => {
  const colorMap: { [key: string]: string } = {
    'docente_ecoe': '#ff9800',
    'docente_asignatura': '#4caf50',
    'estudiante': '#2196f3',
    'jefatura': '#9c27b0'
  };
  return colorMap[role] || '#666';
};

// Función para transformar datos de la API
const transformUserData = (users: User[]): UserTableData[] => {
  return users.map(user => ({
    id: user.id,
    name: user.fullname,
    email: user.email,
    role: mapRoleToDisplayName(user.role),
    roleColor: getRoleColor(user.role),
    subjects: user.role === 'docente_ecoe' || user.role === 'jefatura' ? ['No aplica'] : ['Pendiente'],
    status: 'Activo',
    statusColor: '#4caf50',
    avatar: null
  }));
};

const ProgramDirectorUserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos los roles');
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserTableData[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserRut, setNewUserRut] = useState('');
  const [modalError, setModalError] = useState('');
  
  // Success alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Error alert states
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage] = useState('');

  // Función para obtener usuarios de la API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:3000/api/v1/auth/users/');
      
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      
      const data: User[] = await response.json();
      const transformedUsers = transformUserData(data);
      
      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para filtrar usuarios
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    let filtered = users.filter((user: UserTableData) =>
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.id.toLowerCase().includes(value)
    );

    // Aplicar filtro de rol si no es "Todos los roles"
    if (selectedRole !== 'Todos los roles') {
      filtered = filtered.filter((user: UserTableData) => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  // Función para manejar el cambio de rol
  const handleRoleChange = (event: any) => {
    const role = event.target.value;
    setSelectedRole(role);
    
    let filtered = users;
    
    // Aplicar filtro de búsqueda si hay texto
    if (searchTerm) {
      filtered = filtered.filter((user: UserTableData) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de rol si no es "Todos los roles"
    if (role !== 'Todos los roles') {
      filtered = filtered.filter((user: UserTableData) => user.role === role);
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
    setOpenModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUserEmail('');
    setNewUserRole('');
    setNewUserRut('');
    setModalError('');
  };

  // Función para mapear el rol seleccionado al rol de la API
  const mapDisplayRoleToApiRole = (displayRole: string) => {
    const roleMap: { [key: string]: string } = {
      'Coordinador ECOE': 'docente_ecoe',
      'Coordinador de Asignatura': 'docente_asignatura',
      'Jefatura de Carrera': 'jefatura',
      'Estudiante': 'estudiante'
    };
    return roleMap[displayRole];
  };

  // Función para crear usuario
  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserRole) {
      setModalError('Por favor complete todos los campos obligatorios');
      return;
    }

    if (newUserRole === 'Estudiante' && !newUserRut) {
      setModalError('El RUT es obligatorio para estudiantes');
      return;
    }

    setModalLoading(true);
    setModalError('');
    
    try {
      const apiRole = mapDisplayRoleToApiRole(newUserRole);
      
      if (newUserRole === 'Estudiante') {
        // Crear estudiante
        const response = await fetch('http://localhost:3001/api/v1/students/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rut: newUserRut,
            email: newUserEmail
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Extraer el mensaje de error de la respuesta
          const errorMsg = errorData.message 
            ? (Array.isArray(errorData.message) ? errorData.message[0] : errorData.message)
            : 'Error al crear el estudiante';
          setModalError(errorMsg);
          return;
        }

        setSuccessMessage('Estudiante creado exitosamente');
      } else {
        // Crear usuario (docente/jefatura)
        const response = await fetch('http://127.0.0.1:3000/api/v1/auth/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: newUserEmail,
            role: apiRole
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Extraer el mensaje de error de la respuesta
          const errorMsg = errorData.message 
            ? (Array.isArray(errorData.message) ? errorData.message[0] : errorData.message)
            : 'Error al crear el usuario';
          setModalError(errorMsg);
          return;
        }

        setSuccessMessage('Usuario creado exitosamente');
      }

      setShowSuccessAlert(true);
      handleCloseModal();
      
      // Recargar la lista de usuarios
      await fetchUsers();
      
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setModalLoading(false);
    }
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
          Gestionar Usuarios
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
                  Administración de Usuarios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestione usuarios del sistema y asigne roles y permisos
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
                    <MenuItem value="Estudiante">Estudiante</MenuItem>
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
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Cargando usuarios...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="error">
                          Error: {error}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          onClick={fetchUsers}
                          sx={{ mt: 2 }}
                        >
                          Reintentar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No se encontraron usuarios
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
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
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleChangeRole(user.id)}
                            sx={{
                              backgroundColor: '#f44336',
                              '&:hover': {
                                backgroundColor: '#d32f2f'
                              },
                              textTransform: 'none'
                            }}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
              Configure roles de usuario y asigne permisos específicos - En desarrollo
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Modal para agregar usuario */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="h2" fontWeight={600}>
            Agregar Nuevo Usuario
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Seleccionar Rol</InputLabel>
              <Select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                label="Seleccionar Rol"
              >
                <MenuItem value="Coordinador ECOE">Coordinador ECOE</MenuItem>
                <MenuItem value="Coordinador de Asignatura">Coordinador de Asignatura</MenuItem>
                <MenuItem value="Jefatura de Carrera">Jefatura de Carrera</MenuItem>
                <MenuItem value="Estudiante">Estudiante</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            {newUserRole === 'Estudiante' && (
              <TextField
                fullWidth
                label="RUT"
                value={newUserRut}
                onChange={(e) => setNewUserRut(e.target.value)}
                placeholder="10.100.100-1"
                sx={{ mb: 3 }}
                required
              />
            )}

            {modalError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setModalError('')}
              >
                {modalError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateUser}
            variant="contained"
            disabled={modalLoading}
            startIcon={modalLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#45a049'
              }
            }}
          >
            {modalLoading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta de éxito */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessAlert(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Alerta de error */}
      <Snackbar
        open={showErrorAlert}
        autoHideDuration={4000}
        onClose={() => setShowErrorAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowErrorAlert(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProgramDirectorUserManagement;

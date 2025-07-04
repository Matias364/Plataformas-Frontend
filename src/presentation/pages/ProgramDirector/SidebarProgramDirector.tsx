import { useState } from 'react';
import {
  Drawer, Box, Avatar, Typography, List, ListItemButton, ListItemIcon,
  ListItemText, Button, IconButton, useMediaQuery
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProgramDirectorProps {
  name: string;
  picture: string;
  role: string;
  onLogout: () => void;
}

const drawerWidth = 240;
const collapsedWidth = 64;

const SidebarProgramDirector: React.FC<SidebarProgramDirectorProps> = ({ name, picture, role, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Estadísticas', icon: <BarChartIcon color="primary" />, path: '/director-programa/estadisticas' },
    { label: 'Estudiantes', icon: <PeopleIcon sx={{ color: "#5EC69C" }} />, path: '/director-programa/estudiantes' },
    { label: 'Resultados ECOE', icon: <AssignmentIcon sx={{ color: "#6CC3F8" }} />, path: '/director-programa/resultados-ecoe' },
    { label: 'Gestionar Usuarios', icon: <GroupsIcon sx={{ color: "#F8C46C" }} />, path: '/director-programa/gestionar-usuarios' },
    { label: 'Gestión de Asignaturas', icon: <SchoolIcon sx={{ color: "#17a2b8" }} />, path: '/director-programa/gestion-asignaturas' },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          {!isMobile && (
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 3 }}>
          <Avatar src={picture} sx={{ width: 64, height: 64, mb: 1 }} />
          {!collapsed && (
            <>
              <Typography fontWeight={600}>{name}</Typography>
              <Typography color="text.secondary" fontSize={14}>{role}</Typography>
            </>
          )}
        </Box>

        <List sx={{ mt: 4 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
                color: location.pathname === item.path ? "#7C3AED" : "#222",
                bgcolor: location.pathname === item.path ? "#EDE7F6" : "transparent",
                '&:hover': { bgcolor: "#EDE7F6" },
                minHeight: 48,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <Button
          startIcon={<LogoutIcon />}
          variant="contained"
          sx={{
            bgcolor: "#e0e0e0",
            color: "#444",
            boxShadow: "none",
            '&:hover': { bgcolor: "#d5d5d5" }
          }}
          onClick={onLogout}
          fullWidth
        >
          {!collapsed && "Cerrar sesión"}
        </Button>
      </Box>
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: '#fff',
            boxShadow: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: drawerWidth } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {drawerContent}
        </Drawer>
      </>
    );
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: collapsed ? collapsedWidth : drawerWidth,
          bgcolor: "#F6F6F6",
          border: "none",
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default SidebarProgramDirector;
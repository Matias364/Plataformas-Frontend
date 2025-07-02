import { Drawer, Box, Avatar, Typography, List, ListItemButton, ListItemIcon, ListItemText, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';

const drawerWidth = 240;

const menuItems = [
  { label: 'Competencias', icon: <HomeIcon color="primary" /> },
  { label: 'Estudiantes', icon: <PeopleIcon sx={{ color: "#5EC69C" }} /> },
  { label: 'Registro de Notas', icon: <AssignmentIcon sx={{ color: "#6CC3F8" }} /> },
  { label: 'Anotaciones', icon: <MenuBookIcon sx={{ color: "#F8C46C" }} /> },
  { label: 'Estadisticas ECOE', icon: <BarChartIcon sx={{ color: "#B36CF8" }} /> },
];

interface SidebarTeacherSubjectProps {
  selected: number;
  onSelect: (index: number) => void;
  onLogout: () => void;
}

const SidebarTeacherSubject: React.FC<SidebarTeacherSubjectProps> = ({ selected, onSelect, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: collapsed ? 72 : drawerWidth,
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
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, mt: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#8E44AD", fontWeight: 700, mb: 1, fontSize: 32 }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          {!collapsed && (
            <>
              <Typography fontWeight={700} fontSize={20}>Docente</Typography>
              <Typography color="text.secondary" fontSize={15}>Coordinador de Asignatura</Typography>
            </>
          )}
        </Box>
        <List>
          {menuItems.map((item, idx) => (
            <ListItemButton
              key={item.label}
              selected={selected === idx}
              onClick={() => onSelect(idx)}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: selected === idx ? "#7C3AED" : "#222",
                bgcolor: selected === idx ? "#EDE7F6" : "transparent",
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
      <Box sx={{ px: collapsed ? 1 : 2, pb: 2 }}>
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
    </Drawer>
  );
};

export default SidebarTeacherSubject;
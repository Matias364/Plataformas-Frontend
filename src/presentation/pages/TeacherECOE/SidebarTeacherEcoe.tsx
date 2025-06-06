import React from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarTeacherProps {
  name: string;
  role: string;
  onLogout: () => void;
}

const SidebarTeacherECOE: React.FC<SidebarTeacherProps> = ({ name, role, onLogout }) => (
  <Box sx={{ width: 240, bgcolor: '#fff', height: '100vh', p: 3, borderRight: '1px solid #eee' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
      <Avatar sx={{ bgcolor: '#ff9800', width: 56, height: 56, mb: 1 }}>D</Avatar>
      <Typography fontWeight={700}>Docente</Typography>
      <Typography variant="body2" color="text.secondary">{role}</Typography>
    </Box>
    <List>
      <ListItem disablePadding>
        <ListItemButton selected>
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Gestionar ECOE" />
        </ListItemButton>
      </ListItem>
    </List>
    <Divider sx={{ mt: 2, mb: 2 }} />
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesion" />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
);

export default SidebarTeacherECOE;
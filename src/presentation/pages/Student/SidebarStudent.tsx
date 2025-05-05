import { useState } from 'react';
import { Drawer, Box, Avatar, Typography, List, ListItemButton, ListItemIcon, ListItemText, Button, IconButton, useMediaQuery } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SpeedIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface SidebarStudentProps {
  name: string;
  picture: string;
  selected: string;
  onSelect: (section: string) => void;
  onLogout: () => void;
}

const drawerWidth = 240;
const collapsedWidth = 64;

const SidebarStudent: React.FC<SidebarStudentProps> = ({ name, picture, selected, onLogout }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false); // For mobile
  const [collapsed, setCollapsed] = useState(false); // For desktop

  // Drawer content
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 3 }}>
        <Avatar src={picture} sx={{ width: 64, height: 64, mb: 1 }} />
        {!collapsed && (
          <>
            <Typography fontWeight={600}>{name}</Typography>
            <Typography color="text.secondary" fontSize={14}>Estudiante</Typography>
          </>
        )}
      </Box>
      <List sx={{ mt: 4 }}>
        <ListItemButton selected={selected === 'perfil'} onClick={() => navigate('/perfil')}>
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          {!collapsed && <ListItemText primary="Mi Perfil ECOE" />}
        </ListItemButton>
        <ListItemButton selected={selected === 'rendimiento'} onClick={() => navigate('/rendimiento')}>
          <ListItemIcon><SpeedIcon /></ListItemIcon>
          {!collapsed && <ListItemText primary="Rendimiento" />}
        </ListItemButton>
      </List>
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

  // Desktop drawer (expand/collapse)
  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: collapsed ? collapsedWidth : drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          bgcolor: "#F6F6F6",
          border: "none",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </IconButton>
      </Box>
      {drawerContent}
    </Drawer>
  );
};

export default SidebarStudent;
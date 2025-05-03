import { Drawer, Box, Avatar, Typography, List, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SpeedIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';

interface SidebarStudentProps {
  name: string;
  picture: string;
  selected: string;
  onSelect: (section: string) => void;
  onLogout: () => void;
}

const SidebarStudent: React.FC<SidebarStudentProps> = ({ name, picture, selected, onSelect, onLogout }) => (
  <Drawer
    variant="permanent"
    PaperProps={{
      sx: { width: 240, bgcolor: "#F6F6F6", border: "none", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 3 }}>
      <Avatar src={picture} sx={{ width: 64, height: 64, mb: 1 }} />
      <Typography fontWeight={600}>{name}</Typography>
      <Typography color="text.secondary" fontSize={14}>Estudiante</Typography>
    </Box>
    <List sx={{ mt: 4 }}>
      <ListItemButton selected={selected === 'perfil'} onClick={() => onSelect('perfil')}>
        <ListItemIcon><AssignmentIcon /></ListItemIcon>
        <ListItemText primary="Mi Perfil ECOE" />
      </ListItemButton>
      <ListItemButton selected={selected === 'rendimiento'} onClick={() => onSelect('rendimiento')}>
        <ListItemIcon><SpeedIcon /></ListItemIcon>
        <ListItemText primary="Rendimiento" />
      </ListItemButton>
    </List>
    <Box sx={{ flexGrow: 1 }} />
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
      Cerrar sesión
    </Button>
  </Drawer>
);

export default SidebarStudent;
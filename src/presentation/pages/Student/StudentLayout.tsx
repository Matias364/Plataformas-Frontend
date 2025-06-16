import { Outlet, useLocation } from 'react-router-dom';
import SidebarStudent from './SidebarStudent';
import { getUserData } from '../../../storage/storage';
import { getEmailFromToken, getNameFromEmail } from '../../../utils/authUtils';

const StudentLayout = () => {
  // Obtén los datos del usuario y la foto aquí
  const { accessToken } = getUserData();
  const studentEmail = getEmailFromToken(accessToken);
  const studentName = getNameFromEmail(studentEmail);
  //const studentPicture = userData?.picture || "https://randomuser.me/api/portraits/men/32.jpg"; // fallback
  const studentPicture = "https://randomuser.me/api/portraits/men/32.jpg";

  // Determina la sección seleccionada según la ruta
  const location = useLocation();
  const selected = location.pathname === '/rendimiento' ? 'rendimiento' : 'perfil';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <SidebarStudent
        name={studentName}
        picture={studentPicture}
        selected={selected}
        onSelect={() => {}}
        onLogout={handleLogout}
      />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
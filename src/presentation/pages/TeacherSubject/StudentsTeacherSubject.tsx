import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SearchIcon from '@mui/icons-material/Search';

const students = [
  {
    id: 'STD001',
    name: 'Carlos Martinez',
    email: 'carlos.martinez@universidad.edu',
    promedio: 85,
    estado: 'Activo',
  },
  {
    id: 'STD002',
    name: 'Maria Gonzalez',
    email: 'maria.gonzalez@universidad.edu',
    promedio: 90,
    estado: 'Activo',
  },
  {
    id: 'STD003',
    name: 'Juan Perez',
    email: 'juan.perez@universidad.edu',
    promedio: 75,
    estado: 'Activo',
  },
  {
    id: 'STD004',
    name: 'Ana Rodriguez',
    email: 'ana.rodriguez@universidad.edu',
    promedio: 95,
    estado: 'Activo',
  },
  {
    id: 'STD005',
    name: 'Luis Sanchez',
    email: 'luis.sanchez@universidad.edu',
    promedio: 80,
    estado: 'Activo',
  },
];

const StudentsTeacherSubject = () => (
  <Box sx={{ p: { xs: 0, md: 0 }, width: '100%', marginTop:4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <IconButton size="small" sx={{ bgcolor: '#F6F6F6' }}>
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <Typography variant="h4" fontWeight={700} color="black" mb={0.5}>
        Estudiantes
      </Typography>
    </Box>
    <Typography color="text.secondary" fontSize={15} mb={2}>
      Gestion de estudiantes por asignatura
    </Typography>

    <Box sx={{ mb: 3 }}>
      <TextField
        select
        size="small"
        value="ENF-301 - Enfermeria Clinica"
        sx={{
          minWidth: 260,
          bgcolor: '#fff',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
        }}
        InputProps={{
          sx: { fontWeight: 500 }
        }}
        SelectProps={{
          native: true,
        }}
        disabled
      >
        <option value="ENF-301 - Enfermeria Clinica">ENF-301 - Enfermeria Clinica</option>
      </TextField>
    </Box>

    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        boxShadow: 0,
        borderColor: '#ECECEC',
        p: 2,
        bgcolor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={0.5}>
        Enfermeria Clinica
      </Typography>
      <Typography color="text.secondary" fontSize={15} mb={2}>
        Lista de estudiantes | Codigo: ENF-301 | Semestre: 5to
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar estudiantes."
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: '#BDBDBD' }} />,
            sx: { bgcolor: '#FAFAFA', borderRadius: 2 },
          }}
          sx={{
            width: 340,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2, border: '1px solid #F0F0F0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Promedio</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.promedio}</TableCell>
                <TableCell>
                  <Chip
                    label={student.estado}
                    sx={{
                      bgcolor: '#E8F8F2',
                      color: '#2ECC71',
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<DescriptionOutlinedIcon />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      bgcolor: '#fff',
                      borderColor: '#E0E0E0',
                      color: '#222',
                      px: 2,
                      '&:disabled': {
                        color: '#888',
                        borderColor: '#E0E0E0',
                        bgcolor: '#F5F5F5',
                      },
                    }}
                    disabled
                  >
                    Hoja de Vida
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  </Box>
);

export default StudentsTeacherSubject;
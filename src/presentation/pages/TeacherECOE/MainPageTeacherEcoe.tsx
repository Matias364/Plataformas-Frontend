import React, {useEffect, useState} from "react";
import { getAvailableEcoes, Ecoe } from "../../../infrastructure/services/EcoeService";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import SidebarTeacherECOE from "./SidebarTeacherEcoe";
import { borderRadius, fontWeight, minWidth } from "@mui/system";

const semesterLabelColor = (semester: number) => {
    switch (semester){
        case 4:
            return {label: '4to semestre', color: '#e3e8fd'};
        case 8:
            return {label: '8vo semestre', color: '#e6f4ea'};
        case 10:
            return {label: '10mo semestre', color: '#f3e8fd'};
        default:
            return {label: `${semester}to semestre`, color: '#eee'};
    }
};

const TeacherEcoeMainPage: React.FC = () => {
    const [ecoes, setEcoes] = useState<Ecoe[]>([]);

    useEffect(() => {
        getAvailableEcoes().then(setEcoes);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc'}}>
            <SidebarTeacherECOE name= "Docente" role="Coordinador ECOE" onLogout={handleLogout} />
            <Box sx={{flexGrow: 1, p: {xs: 1, sm: 4}, ml: {xs:0, sm: '240px'}, with: '100%'}}>
                <Box sx={{maxWidth: '1400px', mx: 'auto', width: '100%'}}>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                        Gestionar ECOE
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Seleccione el tipo de ECOE que desea gestionar
                    </Typography>
                    <Stack direction={{xs:'column', md: 'row'}} spacing={3}>
                        {ecoes.map(ecoe => {
                            const {label, color} = semesterLabelColor(ecoe.semestre);
                            return (
                                <Paper key={ecoe.id} elevation={3} sx={{ p:3, borderRadius: 3, minWidth: 320, flex: 1}}>
                                    <Chip label={label} sx={{ bgcolor: color, mb: 2, fontWeight: 700}} />
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                        ECOE {ecoe.semestre === 4 ? 'Basico' : ecoe.semestre === 8 ? 'Profesional' : 'Final'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {ecoe.description}
                                    </Typography>
                                    <Button variant="contained" color="success" sx={{ textTransform: 'none' }} disabled>
                                        Gestionar
                                    </Button>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default TeacherEcoeMainPage;
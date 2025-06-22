/*
import React, {useEffect, useState} from "react";
import { Ecoe } from "../../../domain/ecoe/Ecoe";
import { getAvailableEcoes } from "../../../infrastructure/services/EcoeService";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import SidebarTeacherECOE from "./SidebarTeacherEcoe";
import ManageEcoe from "./ManageECOE";
import { logout } from "../../../utils/logout";

const semesterLabelColor = (semester: number) => {
    switch (semester){
        case 4:
            return {label: '4to semestre', color: '#DBE9FE', textColor: '#3255BE'};
        case 8:
            return {label: '8vo semestre', color: '#DCFCE7', textColor: '#2F7C53'};
        case 10:
            return {label: '10mo semestre', color: '#F3E8FF', textColor: '#8F3AD5'};
        default:
            return {label: `${semester}to semestre`, color: '#eee'};
    }
};

const TeacherEcoeMainPage: React.FC = () => {
    const [ecoes, setEcoes] = useState<Ecoe[]>([]);
    const [selectedEcoe, setSelectedEcoe] = useState<Ecoe | null>(null);

    useEffect(() => {
        getAvailableEcoes().then(setEcoes);
    }, []);

    if(selectedEcoe) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc'}}>
                <SidebarTeacherECOE name="Docente" role="Coordinador ECOE" onLogout={logout} />
                <Box sx={{flexGrow:1, p: {xs:1, sm:4}, ml: {xs:0, sm: '240px'}, width: '100%'}}>
                    <ManageEcoe 
                        ecoe={selectedEcoe} 
                        onBack={() => setSelectedEcoe(null)}
                    />
                </Box>
            </Box>
        );
    }
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafbfc'}}>
            <SidebarTeacherECOE name= "Docente" role="Coordinador ECOE" onLogout={logout} />
            <Box sx={{flexGrow: 1, p: {xs: 1, sm: 4}, ml: {xs:0, sm: '240px'}, with: '100%'}}>
                <Box sx={{maxWidth: '1400px', mx: 'auto', width: '100%'}}>
                    <Typography variant="h4" color='#000000' fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                        Gestionar ECOE
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Seleccione el tipo de ECOE a gestionar
                    </Typography>
                    <Stack direction={{xs:'column', md: 'row'}} spacing={3}>
                        {ecoes.map(ecoe => {
                            const {label, color, textColor} = semesterLabelColor(ecoe.semester);
                            return (
                                <Paper key={ecoe.id} elevation={3} sx={{ p:3, borderRadius: 3, minWidth: 320, flex: 1}}>
                                    <Chip label={label} 
                                    sx={{
                                        bgcolor: color,
                                        mb: 2,
                                        fontWeight: 700,
                                        color: textColor
                                        }} />
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                        ECOE {ecoe.semester === 4 ? 'Basico' : ecoe.semester === 8 ? 'Profesional' : 'Final'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        {ecoe.description}
                                    </Typography>
                                    <Box sx={{ mt: 'auto'}}>
                                        <Button variant="contained" color="success" sx={{ textTransform: 'none', alignSelf: 'flex-start', borderRadius: 2, bgcolor: '#009688' }}
                                        onClick={() => setSelectedEcoe(ecoe)}>
                                        Gestionar
                                    </Button>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export default TeacherEcoeMainPage;*/
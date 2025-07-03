import React from "react";
import { Button, Stack, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const cycles = [
    { label: "Básico", value: "BASICO" },
    { label: "Profesional", value: "PROFESIONAL" },
    { label: "Final", value: "FINAL" },
];

const primaryBlue = "#1565c0";
const primaryBlueHover = "#115293";
const cardBg = "#ffffff"; // Blanco puro para tarjetas

const EcoeCycleSelectorPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSelect = (cycle: string) => {
        navigate(`/docente-ecoe/ecoes/${cycle}`);
    };

    return (
        <>
            <Typography variant="h4" color='#000000' fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                Gestionar ECOE
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Seleccione el tipo de ECOE a gestionar
            </Typography>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ alignItems: "stretch"}}>
                {cycles.map((cycle) => (
                    <Paper
                        key={cycle.value}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            minWidth: 320,
                            minHeight: 200,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            bgcolor: cardBg,
                            color: "#212121", // Gris oscuro para texto
                            boxShadow:
                                "0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24)",
                            transition: "box-shadow 0.3s ease, transform 0.3s ease",
                            "&:hover": {
                                boxShadow:
                                    "0px 4px 8px rgba(0,0,0,0.12), 0px 2px 4px rgba(0,0,0,0.24)",
                                transform: "translateY(-2px)",
                            },
                        }}
                    >
                        <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                ECOE {cycle.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Gestiona el ciclo {cycle.label}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: 2,
                                bgcolor: primaryBlue,
                                color: "#fff",
                                fontWeight: 700,
                                textTransform: "none",
                                minHeight: 40,
                                transition:
                                    "background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                "&:hover": {
                                    bgcolor: primaryBlueHover,
                                    color: "#fff",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                    transform: "translateY(-2px)",
                                },
                            }}
                            onClick={() => handleSelect(cycle.value)}
                        >
                            Gestionar
                        </Button>
                    </Paper>
                ))}
            </Stack>
        </>
    );
};

export default EcoeCycleSelectorPage;

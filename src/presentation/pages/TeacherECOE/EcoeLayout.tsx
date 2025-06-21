import React from "react";
import { Box } from "@mui/material";
import SidebarTeacherECOE from "./SidebarTeacherEcoe";
import { Outlet } from "react-router-dom";
import { logout } from "../../../utils/logout";

const EcoeLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#fafbfc" }}>
      <SidebarTeacherECOE name="Docente" role="Coordinador ECOE" onLogout={logout} />
      
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 4 },
          ml: { xs: 0, sm: "240px" },
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default EcoeLayout;

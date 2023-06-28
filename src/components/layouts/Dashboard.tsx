import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Navigation } from "../Navigation";

const drawerWidth = 88;

interface DashboardProps {
  title: string;
  window?: () => Window;
  children: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({
  window,
  title,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Navigation
          drawerWidth={drawerWidth}
          container={container}
          handleDrawerToggle={handleDrawerToggle}
        />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflow: "auto",
          height: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

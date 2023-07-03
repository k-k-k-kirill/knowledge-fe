import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip, Box } from "@mui/material";
import { ReactComponent as WikisIcon } from "../assets/wikis.svg";
import { ReactComponent as ChatbotsIcon } from "../assets/cahtbots.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";

interface NavigationProps {
  drawerWidth: number;
  container: Element | (() => Element | null) | null | undefined;
  handleDrawerToggle: () => void;
}

const links = [
  {
    label: "Wikis",
    slug: "wikis",
    path: "/wikis",
    icon: <WikisIcon />,
  },
  {
    label: "Chatbots",
    slug: "chatbots",
    path: "/chatbots",
    icon: <ChatbotsIcon />,
  },
];

export const Navigation: React.FC<NavigationProps> = ({ drawerWidth }) => {
  const location = useLocation();
  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "1rem",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Box>
        <NavLink to="/">
          <Logo />
        </NavLink>
      </Box>
      <Box>
        <Toolbar />
        {links.map((link, index) => (
          <Tooltip title={link.label} placement="right">
            <NavLink
              style={{
                height: "auto",
                lineHeight: 1,
              }}
              to={link.path}
              key={link.slug}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1rem",
                  borderRadius: "100%",
                  backgroundColor:
                    location.pathname.includes(link.path) ||
                    (location.pathname === "/" && index === 0)
                      ? "rgba(39, 39, 39, 0.05)"
                      : "transparent",
                  marginBottom: "12px",
                  ":hover": {
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    backgroundColor: "rgba(39, 39, 39, 0.05)",
                  },
                }}
              >
                {link.icon}
              </Box>
            </NavLink>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

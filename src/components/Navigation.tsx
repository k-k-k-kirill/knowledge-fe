import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { NavLink, useLocation } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";

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
    icon: <ImportContactsIcon />,
  },
  {
    label: "Chatbots",
    slug: "chatbots",
    path: "/chatbots",
    icon: <ChatIcon />,
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  drawerWidth,
  container,
  handleDrawerToggle,
}) => {
  const location = useLocation();
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {links.map((link) => (
          <NavLink to={link.path} key={link.slug}>
            <ListItem key={link.slug} disablePadding>
              <ListItemButton selected={location.pathname.includes(link.path)}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <>
      <Drawer
        container={container}
        variant="temporary"
        open={true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

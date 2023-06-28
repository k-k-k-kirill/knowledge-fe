import React from "react";
import { Menu, Box, MenuItem } from "@mui/material";
import { ReactComponent as ProfileIcon } from "../assets/profile.svg";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfileMenu() {
  const { logout } = useAuth0();

  const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget as Element);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Box onClick={(event) => handleMenu(event)}>
        <ProfileIcon />
      </Box>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            })
          }
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

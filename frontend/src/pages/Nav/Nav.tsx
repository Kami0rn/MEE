import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Swal from 'sweetalert2';
import "./Nav.css";

export default function Nav() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContactClick = () => {
    Swal.fire({
      title: 'Contact Information',
      text: 'LineID : @pypuni  ,  Facebook : กิตติพัทธ์ ทิว',
      icon: 'info',
      confirmButtonText: 'Close',
      confirmButtonColor: '#3085d6',
    });
    handleClose(); // Close the menu
  };

  const handleFeedbackClick = () => {
    handleClose(); // Close the menu
    window.open('https://docs.google.com/forms/d/e/1FAIpQLScsTzm2fjOKQmw53C9GEPF6Yb2uLrhjUgu3TtWco2Ypp4PwwQ/viewform?usp=sf_link', '_blank');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#625671" }}>
        <Toolbar className="box">
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: "black" }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center", color: "black", fontFamily: 'Schoolbell, cursive' }}
          >
            Talk with 
            <div>"MEE"</div>
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ color: "black" }}
              >
                <MenuIcon />
              </IconButton>
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
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleFeedbackClick}>Feedback</MenuItem>
                <MenuItem onClick={handleContactClick}>My Contact</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

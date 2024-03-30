// Menu.js
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import auth from "../lib/auth-helper";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo500 from "./../assets/images/InsideOut-Logo500.jpg";

const isActive = (location, path) => {
  return location.pathname === path ? { color: "#ff4081" } : { color: "#ffffff" };
};

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    auth.clearJWT(() => navigate("/"));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Team logo */}
        <img src={Logo500} alt="Logo" style={{ width: 50, marginRight: 10 }} />
        <Typography variant="h6" color="inherit">
          SAMS App
        </Typography>

        <Link to="/">
          <IconButton aria-label="Home" style={isActive(location, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>
        <Link to="/users">
          <Button style={isActive(location, "/users")}>Users</Button>
        </Link>

        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
          </span>
        )}

        {auth.isAuthenticated() && (
          <span>
            <Link to={"/user/" + auth.isAuthenticated().user._id}>
              <Button
                style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}
              >
                My Profile
              </Button>
            </Link>
          </span>
        )}


{/* <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin"></Link> */}
        <Link to="/courses">
          <Button style={isActive(location, "/course")}>Course Name</Button>
        </Link>
        <Link to="/Courses Name"></Link>
      </Toolbar>
    </AppBar>
  );
}

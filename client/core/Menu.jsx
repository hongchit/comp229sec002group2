import { useState, useEffect } from "react";
import {
  makeStyles,
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Home as HomeIcon } from "@material-ui/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo500 from "./../assets/images/InsideOut-Logo500.jpg";

const isActive = (location, path) => {
  return location.pathname === path
    ? { color: "#ff4081" }
    : { color: "#ffffff" };
};
export default function Menu() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          SAMS App
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(location, "/")}>
            <HomeIcon />
          </IconButton>
        </Link>
        {credentials && (
          <Link to="/courses">
            <Button style={isActive(location, "/courses")}>Courses</Button>
          </Link>
        )}
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
                style={isActive(
                  location,
                  "/user/" + auth.isAuthenticated().user._id
                )}
              >
                My Profile
              </Button>
            </Link>
            <Button
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => navigate("/"));
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  );
}

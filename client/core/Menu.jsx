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
import auth from "../lib/auth-helper";

const isActive = (location, path) => {
  return location.pathname === path
    ? { color: "#ff4081" }
    : { color: "#ffffff" };
};
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  username: {
    flexGrow: 1,
    textAlign: "right",
  },
  toolbar: {
    flexGrow: 1,
  },
}));
export default function Menu() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const credentials = auth.isAuthenticated();
  const [homePath, setHomePath] = useState("/");
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (credentials) {
      setHomePath("/courses");
      console.log(homePath);
      setUserName(credentials.user.name + " " + credentials.user.lastName);
    } else {
      setUserName("");
    }
  }, [credentials]);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" color="inherit">
          Student Attendance
        </Typography>
        <Link to={homePath}>
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
        {!credentials && (
          <span>
            <Link to="/signup">
              <Button style={isActive(location, "/signup")}>Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive(location, "/signin")}>Sign In</Button>
            </Link>
          </span>
        )}
        {credentials && (
          <Button
            color="inherit"
            onClick={() => {
              auth.clearJWT(() => navigate("/"));
            }}
          >
            Sign out
          </Button>
        )}
        {credentials && (
          <Link
            to={"/user/" + credentials.user._id}
            className={classes.username}
          >
            <Typography
              variant="body1"
              style={isActive(location, "/user/" + credentials.user._id)}
            >
              {userName}
            </Typography>
          </Link>
        )}

        <div></div>
      </Toolbar>
    </AppBar>
  );
}

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { create } from "./api-user";
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "0 auto",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: "center",
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  error: {
    color: "red",
  },
  submit: {
    margin: "0 auto",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
}));
// const create = async (user) => {
//  return { error: null }; // Simulated API call
// };
export default function Signup() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    lastName: "",
    phone: "",
    user_role: "student",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      lastName: values.lastName || undefined,
      phone: values.phone || undefined,
      user_role: values.user_role || "student",
      confirmPassword: values.confirmPassword || undefined,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setOpen(true);
      }
    });
  };
  Signup.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign Up
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              id="name"
              label="First Name"
              className={classes.textField}
              value={values.name}
              onChange={handleChange("name")}
              margin="normal"
            />
            <TextField
              id="lastName"
              label="Last Name"
              className={classes.textField}
              value={values.designation}
              onChange={handleChange("lastName")}
              margin="normal"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              value={values.email}
              onChange={handleChange("email")}
              margin="normal"
            />
            <TextField
              id="phone"
              label="Phone"
              className={classes.textField}
              value={values.phone}
              onChange={handleChange("phone")}
              margin="normal"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <TextField
              id="password"
              label="Password"
              className={classes.textField}
              value={values.password}
              onChange={handleChange("password")}
              type="password"
              margin="normal"
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              className={classes.textField}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              type="password"
              margin="normal"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={values.user_role}
              onChange={handleChange("user_role")}
            >
              <FormControlLabel
                value="professor"
                control={<Radio />}
                label="Professor"
              />
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
            </RadioGroup>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <br />{" "}
            {values.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error}>
                  error
                </Icon>
                {values.error}
              </Typography>
            )}
          </div>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/Signin">
            <Button
              color="primary"
              autoFocus
              variant="contained"
              onClick={handleClose}
            >
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}

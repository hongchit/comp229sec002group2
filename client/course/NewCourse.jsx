"use strict";
import { useState, useEffect } from "react";
import auth from "../lib/auth-helper.js";
import { create } from "../lib/api-course.js";
import {
  useNavigate,
  useParams,
  Link as RouterLink,
  Navigate,
} from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  card: {
    // Define your card styles here
  },
  cardcontent: {
    display: "flex",
    flexDirection: "column",
  },
  textField: {
    // Define your text field styles here
  },
  error: {
    // Define your error icon styles here
  },
  submit: {
    // Define your submit button styles here
  },
  title: {
    // Define your title styles here
  },
  root: {
    // Define your root styles here
    // display: "flex",
    // flexDirection: "column",
    // flexWrap: "wrap",
    // justifyContent: "space-around",
  },
}));
export default function NewCourse() {
  const classes = useStyles();
  const navigate = useNavigate();
  const credentials = auth.isAuthenticated();
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  if (!credentials) {
    setRedirectToSignin(true);
  }

  const [values, setValues] = useState({
    name: "",
    total_lessons: 1,
  });
  const [open, setOpen] = useState(false);
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const handleClose = () => {
    setOpen(false);
    navigate("/courses");
  };

  const clickSubmit = () => {
    const course = {
      name: values.name || undefined,
      total_lessons: values.total_lessons || 1,
    };
    const abortController = new AbortController();
    const signal = abortController.signal;
    create(credentials.user._id, course, credentials.token, signal).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setOpen(true);
        }
      }
    );
  };
  NewCourse.open = open;
  NewCourse.handleClose = handleClose;
  NewCourse.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  if (redirectToSignin) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardcontent}>
          <Typography variant="h6" className={classes.title}>
            Add New Course
          </Typography>

          <TextField
            id="name"
            label="Course Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
          />
          <TextField
            id="total_lessons"
            label="Total No. of Lessons"
            className={classes.textField}
            value={values.designation}
            onChange={handleChange("total_lessons")}
            margin="normal"
          />
        </CardContent>

        <CardActions>
          <Button
            color="primary"
            variant="contained"
            component={RouterLink}
            to="/courses"
          >
            Back
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Add
          </Button>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New course successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/courses">
            <Button
              color="primary"
              autoFocus
              variant="contained"
              onClick={handleClose}
            >
              Return to courses
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}

"use strict";
import { useState, useEffect } from "react";
import auth from "../lib/auth-helper.js";
import { getCourse } from "../lib/api-course.js";
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
export default function EditCourse() {
  const classes = useStyles();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const credentials = auth.isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    total_lessons: 1,
    open: false,
    error: "",
    NavigateToProfile: false,
  });
  if (!credentials) {
    setValues({ ...values, NavigateToProfile: true });
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const clickCancel = () => {
    navigate("/courses");
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getCourse(
      {
        courseId: courseId,
        userId: credentials.user._id,
      },
      { t: credentials.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          total_lessons: data.total_lessons,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [courseId, credentials.token, credentials.user._id]);
  const clickSubmit = () => {
    const course = {
      name: values.name || undefined,
      total_lessons: values.total_lessons || 1,
    };
    const abortController = new AbortController();
    const signal = abortController.signal;
    // create(credentials.user._id, course, credentials.token, signal).then(
    //   (data) => {
    //     if (data.error) {
    //       setValues({ ...values, error: data.error });
    //     } else {
    //       setOpen(true);
    //     }
    //   }
    // );
  };

  if (values.NavigateToProfile) {
    return <Navigate to="/courses" />;
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardcontent}>
          <Typography variant="h6" className={classes.title}>
            Edit Course
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
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>

        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickCancel}
            className={classes.submit}
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
    </div>
  );
}

"use strict";
import { useState, useEffect } from "react";
import auth from "../lib/auth-helper.js";
import { list } from "../lib/api-course.js";
import { Link as RouterLink, Navigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  IconButton,
  ImageList,
  ImageListItem,
  Link,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: "90%",
    marginLeft: "auto !important",
    marginRight: "auto !important",
  },
  card: {
    // Define your card styles here
    width: "80%",
    height: "80%",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardcontent: {
    textAlign: "center",
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
export default function Courses() {
  const credentials = auth.isAuthenticated();
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  if (!credentials) {
    setRedirectToSignin(true);
  }

  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(credentials.user._id, credentials.token, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setCourses(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [credentials.user._id, credentials.token]);

  if (redirectToSignin) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <Typography variant="h6" className={classes.title}>
        My Courses
      </Typography>

      <ImageList rowHeight={160} className={classes.gridList} cols={4}>
        {courses.map((item, i) => {
          return (
            <ImageListItem key={i}>
              <Link component={RouterLink} to={"/course/" + item._id} key={i}>
                <Card className={classes.card} elevation={4}>
                  <CardContent className={classes.cardcontent}>
                    <Typography variant="h5" component="h2">
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="h3"
                      className="classes.coursedetails"
                    >
                      Total lessons: {item.total_lessons}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </ImageListItem>
          );
        })}
        <ImageListItem key={0}>
          <Link component={RouterLink} to={"/courses/new"} key={0}>
            <Card className={classes.card} elevation={4}>
              <CardContent className={classes.cardcontent}>
                <IconButton className={classes.button} aria-label="New Course">
                  <AddIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Link>
        </ImageListItem>
      </ImageList>
    </Paper>
  );
}

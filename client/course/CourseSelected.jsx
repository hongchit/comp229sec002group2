import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getCourse } from "../lib/api-course.js";
import { Navigate, useParams } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import LessonSidebar from "./LessonSidebar.jsx";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    textAlign: "center",
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },

  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
}));

export default function CourseSelected() {
  const paras = useParams();
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [courseData, setCourseData] = useState();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getCourse(
      {
        courseId: paras.courseId,
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setCourseData(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  let totalLessons = courseData ? courseData.total_lessons : 0;

  return (
    <div style={{ display: "flex" }}>
      <LessonSidebar numLessons={totalLessons} />
      <div style={{ flexGrow: 1, marginLeft: "0px" }}>
        <h2>Course Selected: {courseData && courseData.name}</h2>
        <h3>Professor: {courseData && courseData.professor.name}</h3>
      </div>
    </div>
  );
}

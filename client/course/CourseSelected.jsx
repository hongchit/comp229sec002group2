import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { getCourse } from "../lib/api-course.js";
import { Navigate, useParams } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import LessonSidebar from "./LessonSidebar.jsx";
import Grid from "@material-ui/core/Grid";
import AttendentTable from "./AttendentTable.jsx";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    margin: 10,
  },
  card: {
    textAlign: "center",
    paddingBottom: theme.spacing(2),
  },
  title: {
    // margin: theme.spacing(1),
    color: theme.palette.primary.dark,
    fontSize: "2.4em",
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },

  error: {
    verticalAlign: "middle",
  },
  textField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    // width: 400,
    fontSize: "2em",
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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CourseSelected() {
  const { courseId } = useParams();
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [courseData, setCourseData] = useState();

  const query = useQuery();
  const [numLesson, setNumLesson] = useState(query.get("numLesson") || 0);

  const numLessonsPara = parseInt(query.get("numLesson"), 10);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (numLessonsPara) {
      setNumLesson(numLessonsPara);
    }

    getCourse(
      {
        courseId: courseId,
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setRedirectToSignin(true);
        console.log(data.error);
      } else {
        console.log(data);
        setCourseData(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [courseId, jwt.token, jwt.user._id, numLessonsPara]);

  if (redirectToSignin) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }
  if (auth.isAuthenticated()) {
    console.log(auth.isAuthenticated().user._id);
  }

  let totalLessons = courseData ? courseData.total_lessons : 0;

  //TODO - need to check if the user is a student or professor
  return (
    <div className={classes.root}>
      <LessonSidebar numLessons={totalLessons} courseId={courseId} />
      <div style={{ flexGrow: 1, marginLeft: "0px" }}>
        <Typography variant="h2" className={classes.title}>
          Course Selected: {courseData && courseData.name}
        </Typography>
        <Typography variant="h3" className={classes.textField}>
          Professor: {courseData && courseData.professor.name}
        </Typography>

        <AttendentTable
          numLesson={numLesson}
          courseId={courseId}
          userId={jwt.user._id}
          isProfessor={jwt.user.role}
        ></AttendentTable>
      </div>
    </div>
  );
}

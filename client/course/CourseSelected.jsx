import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCourse } from "../lib/api-course.js";
import { Navigate, useParams } from "react-router-dom";
import auth from "../lib/auth-helper.js";
import LessonSidebar from "./LessonSidebar.jsx";
import AttendentTable from "./AttendentTable.jsx";
import { makeStyles, IconButton, Typography } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Equalizer as EqualizerIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    margin: 10,
  },
  sidebar: {},
  content: {
    flexGrow: 1,
    marginLeft: "0px",
  },
  actions: {
    float: "right",
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
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [courseData, setCourseData] = useState();

  const query = useQuery();
  const [lessonNum, setLessonNum] = useState(query.get("lessonNum") || 0);

  const lessonNumPara = parseInt(query.get("lessonNum"), 10);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    if (lessonNumPara) {
      setLessonNum(lessonNumPara);
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
  }, [courseId, jwt.token, jwt.user._id, lessonNumPara]);

  if (redirectToSignin) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }
  if (auth.isAuthenticated()) {
    console.log(auth.isAuthenticated().user._id);
  }

  const clickStat = () => {
    navigate("/course/" + courseId + "/stat");
  };
  const clickDelete = () => {
    navigate("/course/" + courseId + "/delete");
  };

  let totalLessons = courseData ? courseData.total_lessons : 0;

  //TODO - need to check if the user is a student or professor
  return (
    <div className={classes.root}>
      <LessonSidebar
        className={classes.sidebar}
        numLessons={totalLessons}
        courseId={courseId}
      />
      <div className={classes.content}>
        <div className={classes.actions}>
          <IconButton
            className={classes.button}
            aria-label="Statistics"
            onClick={clickStat}
          >
            <EqualizerIcon />
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label="Delete"
            onClick={clickDelete}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        <Typography variant="h2" className={classes.title}>
          Course Selected: {courseData && courseData.name}
        </Typography>
        <Typography variant="h3" className={classes.textField}>
          Professor: {courseData && courseData.professor.name}
        </Typography>

        <AttendentTable
          lessonNum={lessonNum}
          courseId={courseId}
          userId={jwt.user._id}
          isProfessor={jwt.user.role}
        ></AttendentTable>
      </div>
    </div>
  );
}

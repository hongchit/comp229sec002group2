import { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  Navigate,
  Link as RouterLink,
} from "react-router-dom";
import { getCourse } from "../lib/api-course.js";
import auth from "../lib/auth-helper.js";
import LessonSidebar from "./LessonSidebar.jsx";
import AttendentTable from "./AttendentTable.jsx";
import { makeStyles, IconButton, Typography } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Equalizer as EqualizerIcon,
} from "@material-ui/icons";
import DeleteCourse from "./DeleteCourse.jsx";

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

  let totalLessons = courseData ? courseData.total_lessons : 0;
  const isProfessor = jwt.user.role === "professor";
  console.log(`isProfessor: ${isProfessor}`);

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
            component={RouterLink}
            to={`/course/${courseId}/stat`}
          >
            <EqualizerIcon />
          </IconButton>
          <IconButton
            className={classes.button}
            aria-label="Edit Course"
            component={RouterLink}
            to={`/course/${courseId}/edit`}
          >
            <EditIcon />
          </IconButton>
          <DeleteCourse courseId={courseId} />
        </div>
        <Typography variant="h2" className={classes.title}>
          Course Selected: {courseData && courseData.name}
        </Typography>
        <Typography variant="h3" className={classes.textField}>
          Professor: {courseData && courseData.professor.name}
        </Typography>

        <AttendentTable
          lessonNum={lessonNum}
          total_lessons={totalLessons}
          courseId={courseId}
          userId={jwt.user._id}
          isProfessor={isProfessor}
        ></AttendentTable>
      </div>
    </div>
  );
}

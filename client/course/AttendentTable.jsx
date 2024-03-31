import { useState, useEffect } from "react";
import {
  makeStyles,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core/";
import { getAttendanceList, updateAttendanceList } from "../lib/api-course";
import auth from "../lib/auth-helper";

const useStyles = makeStyles((theme) => ({
  formGroup: {
    //margin: theme.spacing(1),
    margin: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`, // Add a subtle border
    borderRadius: theme.shape.borderRadius, // Use theme's border radius for consistency
    padding: theme.spacing(4), // Add padding for internal spacing
    backgroundColor: theme.palette.background.paper, // Use theme's background color
  },
  formControlLabel: {
    display: "block", // Ensure the label takes up the full width
    margin: theme.spacing(1), // Space between each FormControlLabel
    border: `1px solid ${theme.palette.grey[300]}`, // Border around each choice
    borderRadius: theme.shape.borderRadius, // Rounded corners for each choice
    padding: theme.spacing(1), // Padding inside each FormControlLabel
    "&:hover": {
      backgroundColor: theme.palette.action.hover, // Optional: change background on hover
    },
  },
  lessonTitle: {
    margin: theme.spacing(2, 0), // Add vertical margin for spacing, no horizontal margin
    color: theme.palette.primary.main, // Use the primary color from the theme
    fontWeight: "bold", // Make it bold to stand out
    textAlign: "center", // Center-align the title for emphasis
    padding: theme.spacing(1), // Add some padding for aesthetic spacing
    backgroundColor: theme.palette.background.default, // Optional: a background color from the theme
    borderRadius: theme.shape.borderRadius, // Rounded corners for a subtle, modern look
    boxShadow: `0 2px 4px ${theme.palette.grey[300]}`, // Soft shadow for depth (adjust color based on your theme's palette)
    textTransform: "uppercase", // UPPERCASE for stylistic choice (optional)
  },
}));

function AttendentTable({
  lessonNum,
  total_lessons,
  courseId,
  userId,
  isProfessor,
}) {
  //let attendanceList;
  const jwt = auth.isAuthenticated();
  const abortController = new AbortController();
  const signal = abortController.signal;
  console.log(lessonNum, courseId, userId, isProfessor);
  const classes = useStyles();

  //const [lesson, setLesson] = useState(null);

  const [lesson, setLesson] = useState({ attendance: [] });
  //const [updatedAttendance, setUpdatedAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    //when lessonNum is 0, set the lesson to an empty object
    if (lessonNum === 0) {
      setLesson({ attendance: [] });
      return;
    }
    setLoading(true);
    getAttendanceList(
      {
        userId: userId,
        courseId: courseId,
        lessonNum: lessonNum,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data && data.error) {
        console.log(`error: ${data.error}`);
      } else {
        setLesson(data);
        //setUpdatedAttendance(data.attendance);
        console.log(`attendance data: ${data.attendance}`);
      }
      setLoading(false);
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [lessonNum, courseId, userId, jwt.token]);

  const handleCheckboxChange = (studentId, checked) => {
    const updatedLesson = {
      ...lesson,
      attendance: lesson.attendance.map((record, i) =>
        record.student === studentId
          ? { ...record, attendance_status: checked }
          : record
      ),
    };
    setLesson(updatedLesson);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    //console.log("Submitting attendance records:", lesson.attendance);
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      let response = await updateAttendanceList(
        {
          userId,
          courseId,
          lessonNum,
          total_lessons: total_lessons,
          attendance: lesson.attendance,
        },
        { t: jwt.token },
        signal
      );
      if (response.error) {
        console.log(response.error);
      } else {
        console.log("Attendance updated successfully", response);
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (lessonNum === 0) {
    return (
      <Typography variant="h6" className={classes.lessonTitle}>
        Please select a lesson.
      </Typography>
    );
  }

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!lesson) {
    return (
      <Typography variant="h6" className={classes.lessonTitle}>
        Attendance data is not available
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h6" className={classes.lessonTitle}>
        Lesson: {lessonNum}
      </Typography>

      <FormGroup className={classes.formGroup}>
        {lesson.attendance.map((record, index) => (
          <FormControlLabel
            className={classes.formControlLabel}
            key={record._id}
            control={
              <Checkbox
                checked={record.attendance_status}
                onChange={(event) =>
                  handleCheckboxChange(record.student, event.target.checked)
                }
                disabled={!isProfessor}
                color="primary"
              />
            }
            label={`Student ID: ${record.student}`}
          />
        ))}
      </FormGroup>

      {isProfessor && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isProfessor}
        >
          Submit Changes
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update attendance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lesson {lessonNum} attendance has been updated successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            autoFocus
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Typography variant="body1" component="pre">
        {JSON.stringify(lesson, null, 2)}
      </Typography> */}
    </div>
  );
}

export default AttendentTable;

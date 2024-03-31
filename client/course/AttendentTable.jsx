import { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { getAttendanceList } from "../lib/api-course";
import auth from "../lib/auth-helper";

function AttendentTable({ lessonNum, courseId, userId, isProfessor }) {
  //let attendanceList;
  const jwt = auth.isAuthenticated();
  const abortController = new AbortController();
  const signal = abortController.signal;
  console.log(lessonNum, courseId, userId, isProfessor);

  const [attendanceList, setAttendanceList] = useState(null);

  useEffect(() => {
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
        console.log(data.error);
      } else {
        setAttendanceList(data);
        console.log(`attendance data: ${data}`);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [lessonNum, courseId, userId]);

  if (lessonNum === 0) {
    return <Typography variant="h6">Please select a lesson</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">
        Attendent Table {lessonNum}, {courseId} , {userId}, {isProfessor}
      </Typography>
      <Typography variant="body1" component="pre">
        {JSON.stringify(attendanceList, null, 2)}
      </Typography>
    </div>
  );
}

export default AttendentTable;

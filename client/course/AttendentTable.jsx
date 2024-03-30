import React from "react";
import Typography from "@material-ui/core/Typography";

function AttendentTable({ numLesson, courseId, userId, isProfessor }) {
  if (numLesson === 0) {
    return <Typography variant="h6">Please select a lesson</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">
        Attendent Table {numLesson}, {courseId} , {userId}, {isProfessor}
      </Typography>
    </div>
  );
}

export default AttendentTable;

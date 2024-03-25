"use strict";
/**
 * Subdocument Schema for the Lesson model under Course model
 */

import { Schema, model } from "mongoose";

export const AttendanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendance_status: {
    type: Boolean,
  },
});

const Attendance = model("Attendance", AttendanceSchema);

/**
 * Expose Status enum
 */
Attendance.Status = class Status {
  static PRESENT = true;
  static ABSENT = false;
};

export default Attendance;

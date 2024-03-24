"use strict";
/**
 * Subdocument Schema for the Lesson model under Course model
 */

import { Schema, model } from "mongoose";

class Status {
  static PRESENT = true;
  static ABSENT = false;
}

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

const AttendanceModel = model("Attendance", AttendanceSchema);

/**
 * Helper class to facilitate Model operations
 */
class Attendance extends AttendanceModel {
  /**
   * Expose Status enum
   */
  static Status = Status;
}

export default Attendance;

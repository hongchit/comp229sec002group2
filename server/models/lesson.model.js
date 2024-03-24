"use strict";
/**
 * Subdocument Schema for the Lesson model under Course model
 */

import { Schema, model } from "mongoose";
import Attendance, { AttendanceSchema } from "./attendance.model.js";

export const LessonSchema = new Schema({
  lesson_num: {
    type: Number,
    index: true,
    required: true,
  },
  lesson_date: {
    type: Date,
    index: true,
  },
  attendance: [AttendanceSchema],
});

const LessonModel = model("Lesson", LessonSchema);

/**
 * Helper class to facilitate Model opearations
 */
class Lesson extends LessonModel {
  /**
   * Expose Attendance Subdocument Model
   */
  static Attendance = Attendance;
}

export default Lesson;

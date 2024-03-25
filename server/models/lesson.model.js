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
    default: Date.now,
  },
  attendance: [AttendanceSchema],
});
LessonSchema.methods = {
  updateAttendance: function (student, status) {
    // console.log(
    //   "Lesson: " +
    //     this +
    //     "\n" +
    //     typeof student +
    //     " student: " +
    //     student +
    //     ", status: " +
    //     status
    // );
    if (!student.id || !typeof student == "User" || !student.isStudent()) {
      throw "Attendance key must be a student of type User model";
    }

    let record = undefined;
    if (this.attendance) {
      for (let item of this.attendance) {
        if (item.student.id == student.id) {
          record = item;
          break;
        }
      }
    } else {
      this.attendance = [];
    }
    if (!record) {
      record = new Attendance({
        student: student,
        status: status,
      });
      this.attendance.push(record);
    } else {
      record.status = status;
    }
  },
};

const Lesson = model("Lesson", LessonSchema);

/**
 * Expose Attendance Subdocument Model
 */
Lesson.Attendance = Attendance;

export default Lesson;

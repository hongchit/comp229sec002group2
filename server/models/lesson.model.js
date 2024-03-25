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
    if (!student.id || !typeof student == "User" || !student.isStudent()) {
      throw "Attendance key must be a student of type User model";
    }

    let pushNeeded = false;
    let record = undefined;
    let index = undefined;
    if (this.attendance) {
      for (let i = 0; i < this.attendance.size; i++) {
        if (this.attendance[i].id == student.id) {
          index = i;
          break;
        }
      }
    }
    if (index === undefined || !this.attendance[index]) {
      let newRecord = new Attendance({
        student: student,
        attendance_status: status,
      });
      index = this.attendance.size;
      pushNeeded = true;
      // console.log("record newrecord: " + newRecord);
      record = newRecord;
      // console.log("record new: " + record);
    } else {
      record = this.attendance[index];
      record.attendance_status = status;
      // console.log("record existing: " + record);
    }
    if (pushNeeded) {
      this.attendance.push(record);
    }

    // if (!record) {
    //   record = new Attendance({
    //     student: student,
    //     status: status,
    //   });
    //   this.attendance.push(record);
    // } else {
    //   record.status = status;
    // }
  },
};

const Lesson = model("Lesson", LessonSchema);

/**
 * Expose Attendance Subdocument Model
 */
Lesson.Attendance = Attendance;

export default Lesson;

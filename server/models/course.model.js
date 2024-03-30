"use strict";
/**
 * Schema for the course model
 */

import { Schema, model } from "mongoose";
import Lesson, { LessonSchema } from "./lesson.model.js";
import User from "./user.model.js";

const CourseSchema = new Schema({
  name: {
    type: String,
    trim: true,
    index: true,
    required: "Name is required",
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total_lessons: {
    type: Number,
    min: 1,
  },
  lessons: [LessonSchema],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});
CourseSchema.methods = {
  /**
   * Set or update the attendance for the given Students in the attendance Map
   * The Lesson subdocument will be created if needed. Date will be assigned
   * the first time the attendance is taken.
   * @param {int} lesson_num
   * @param {Map<User, boolean>} attendance
   */
  updateAttendance: async function (lesson_num, attendance) {
    if (!lesson_num || !Number.isInteger(lesson_num) || lesson_num <= 0) {
      throw "Invalid lesson_num: " + lesson_num;
    }
    if (!attendance instanceof Map) {
      throw "Invalid attendance data. Encapsulate attendance in Map<User, boolean>";
    }
    console.log(
      "Updating attendence on lesson " +
        lesson_num +
        " with " +
        attendance.size +
        " records."
    );

    let index = undefined;
    if (this.lessons) {
      for (let i = 0; i < this.lessons.length; i++) {
        if (this.lessons[i] && this.lessons[i].lesson_num == lesson_num) {
          index = i;
          break;
        }
      }
    }
    let pushNeeded = false;
    let lessonSelected = undefined;
    if (index === undefined || !this.lessons[index]) {
      let lesson = new Lesson({
        lesson_num: lesson_num,
      });
      index = this.lessons.size;
      pushNeeded = true;
      // this.lessons.addToSet(lesson);
      lessonSelected = lesson;
    } else {
      lessonSelected = this.lessons[index];
    }
    if (!lessonSelected.lesson_num) {
      lessonSelected.lesson_num = lesson_num;
    }
    if (!lessonSelected.lesson_date) {
      lessonSelected.lesson_date = Date.now;
    }

    attendance.forEach((value, key) => {
      lessonSelected.updateAttendance(key, value);
    });

    if (pushNeeded) {
      this.lessons.push(lessonSelected);
    }
    console.log(this);
  },
};

const Course = model("Course", CourseSchema);

/**
 * List courses
 * @param {User} professor Limit result to the specified professor. Leave empty to list all courses.
 */
Course.list = async function (professor) {
  let filter = undefined;
  if (professor) {
    if (!professor.id) {
      throw "Invalid professor object";
    }
    filter = { professor: { $eq: professor } };
  }

  let courses = await Course.find(filter).select(
    "name professor total_lessons lessons created updated"
  );
  return courses;
};

/**
 * Find the course with the specified professor and course name
 * @param {User} professor
 * @param {string} course_name
 * @returns Course
 */
Course.findByProfessorCourseName = async function (professor, course_name) {
  if (!professor || !professor.id) {
    throw "Invalid professor object";
  }
  if (!course_name) {
    throw "Course name is required";
  }

  let filter = {
    professor: { $eq: professor },
    name: { $eq: course_name },
  };
  let course = await Course.findOne(filter);
  return course;
};

/**
 * Expose Lesson Subdocument Model
 */
Course.Lesson = Lesson;

export default Course;

// static async courseWithDetails(professor, course_id) {
//   let course = await Lesson.findById(course_id);

//   let course = await Course.findById(id).populate("professor").exec();
//   if (!course) {
//     return res.status("400").json({
//       error: "Course not found",
//     });
//   }

//   return course;
// }

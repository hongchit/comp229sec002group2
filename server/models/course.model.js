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
    let selectedLesson = undefined;
    if (!lesson_num || !Number.isInteger(lesson_num) || lesson_num <= 0) {
      throw "Invalid lesson_num: " + lesson_num;
    }
    if (!attendance instanceof Map) {
      throw "Invalid attendance data. Encapsulated attendance in Map<User, boolean>";
    }
    console.log(
      "Updating attendence on lesson " +
        lesson_num +
        " with " +
        attendance.size +
        " records."
    );

    for (let lesson of this.lessons) {
      if (lesson && lesson.lesson_num == lesson_num) {
        selectedLesson = lesson;
      }
    }
    if (selectedLesson === undefined) {
      selectedLesson = new Lesson({
        lesson_num: lesson_num,
        lesson_date: Date.now,
      });
      this.lessons.push(selectedLesson);
      console.log("New lesson appended: " + selectedLesson);
    } else {
      console.log("Found existing lessson: " + selectedLesson);
    }
    if (!selectedLesson.lesson_num) {
      console.log("*** Update lesson num again: " + lesson_num);
      selectedLesson.lesson_num = lesson_num;
    }
    if (!selectedLesson.lesson_date) {
      console.log("*** Update lesson date again: " + Date.now);
      selectedLesson.lesson_date = Date.now;
    }
  },
};

const CourseModel = model("Course", CourseSchema);

/**
 * Helper class to facilitate Model opearations
 */
class Course extends CourseModel {
  /**
   * Expose Lesson Subdocument Model
   */
  static Lesson = Lesson;

  /**
   * List courses
   * @param {User} professor Limit result to the specified professor. Leave empty to list all courses.
   */
  static async list(professor) {
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
  }

  /**
   * Find the course with the specified professor and course name
   * @param {User} professor
   * @param {string} course_name
   * @returns Course
   */
  static async findByProfessorCourseName(professor, course_name) {
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
  }

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
}

export default Course;

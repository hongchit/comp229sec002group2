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

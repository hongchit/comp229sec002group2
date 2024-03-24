"use strict";
/**
 * Schema for the course model
 */

import { Schema, model } from "mongoose";
import Lesson, { LessonSchema } from "./lesson.model.js";

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
  lessions: [LessonSchema],
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

class Course extends CourseModel {
  static Lesson = Lesson;
}

export default Course;

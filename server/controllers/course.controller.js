"use strict";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import formidable from "formidable";
import fs from "fs";

const courseByID = (req, res) => {
  //TODO - get course by ID
  next();
};

const lessonByID = (req, res) => {
  //TODO - get lesson by ID
  next();
};

const create = (req, res) => {
  //TODO - create course
};

const listByUser = (req, res) => {
  //TODO - list courses by user
};

const remove = (req, res) => {
  //TODO - remove course
};

const numLesson = (req, res) => {
  //TODO - get number of lessons
};

const stat = (req, res) => {
  //TODO - get statistics
};

const attendanceByLesson = (req, res) => {
  //TODO - get attendance by lesson
};

const updateAttendanceByLesson = (req, res) => {
  //TODO - update attendance by lesson
};

// Populate database with default data
const initData = async (req, res) => {
  let clear = false;
  if (req.query && req.query.clear) {
    clear = true;
  }

  try {
    if (clear) {
      await Course.deleteMany();
    }

    let professorEsther = await User.findByName("Esther");
    // return res.json(professorEsther);

    let students = await User.list(User.Role.STUDENT);
    let attendance = [];
    students.forEach((student) => {
      let status =
        Math.random() > 0.33
          ? Course.Lesson.Attendance.Status.PRESENT
          : Course.Lesson.Attendance.Status.ABSENT;
      attendance.push(
        new Course.Lesson.Attendance({
          student: student,
          attendance_status: status,
        })
      );
    });

    await new Course({
      name: "COMP006",
      professor: professorEsther,
      total_lessons: 6,
      lessions: [
        new Course.Lesson({
          lesson_num: 6,
          lesson_date: Date.now + 0, // Doesn't work without the calculation
          attendance: attendance,
        }),
      ],
    }).save();
    return res.status(200).json({
      message: "Courses created in database.",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  courseByID,
  lessonByID,
  create,
  listByUser,
  remove,
  numLesson,
  attendanceByLesson,
  updateAttendanceByLesson,
  initData,
};

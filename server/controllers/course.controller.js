"use strict";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./../helpers/dbErrorHandler.js";
import formidable from "formidable";
import fs from "fs";

// Get course by ID
const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id)
      .populate("professor")
      // Don't populate students here in attendance for better performance
      // .populate("lessons.attendance.student")
      .exec();
    if (!course) {
      return res.status(400).json({
        error: "Course not found",
      });
    }
    console.log("Course: " + course);
    req.course = course;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve course",
    });
  }
};

const read = async (req, res) => {
  let course = req.course;

  // If needed, can populate after model being constructed.
  // Better to limit result to show only 1 lesson
  //
  // let course = await req.course.populate("lessons.attendance.student");

  // TODO - Check professor == login user, or login user is attending the course.
  // // Permission check: Check professor == current login user
  // if (req.profile.id != course.professor.id) {
  //   // User is not professor. No access
  //   return res.status(403).json({
  //     error: "User is not authorized",
  //   });
  // }
  return res.json(req.course);
};

const lessonByID = (req, res) => {
  //TODO - get lesson by ID
  next();
};

const create = (req, res) => {
  //TODO - create course
};

const listByUser = async (req, res) => {
  //TODO - list courses by user

  try {
    // Sample testing code: Current user is hardcoded as "Esther".
    // Change to current logged-in user with the professor role
    // let currentUser = await User.findByName("Esther");

    const currentUser = req.profile;
    let courses = await Course.list(currentUser);
    res.json(courses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = (req, res) => {
  //TODO - remove course
};

const courseDetails = (req, res) => {
  //TODO - get number of lessons
};

const stat = (req, res) => {
  //TODO - get statistics
};

const updateAttendance = (req, res) => {
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
    let students = await User.list(User.Role.STUDENT);

    let professorEsther = await User.findByName("Esther");
    let courseCOMP006 =
      !clear &&
      (await Course.findByProfessorCourseName(professorEsther, "COMP006"));
    if (!courseCOMP006) {
      // Create course COMP006
      // return res.json(professorEsther);

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
        lessons: [
          new Course.Lesson({
            lesson_num: 6,
            lesson_date: Date.now + 0, // Doesn't work without the calculation. Otherwise, field is not saved in MongoDB.
            attendance: attendance,
          }),
        ],
      }).save();
    }

    let professorMadison = await User.findByName("Madison");
    let courseComp102 =
      !clear &&
      (await Course.findByProfessorCourseName(professorMadison, "COMP102"));
    console.log("== New course: " + courseComp102);

    if (clear || !courseComp102.id) {
      // Create course COMP102
      courseComp102 = new Course({
        name: "COMP102",
        professor: professorMadison,
        total_lessons: 0,
      });
      console.log("New course: " + courseComp102);
    }

    // Add one more lesson & attendence on each execution
    courseComp102.total_lessons++;
    courseComp102.updateAttendance(courseComp102.total_lessons, new Map());
    console.log("Updating course: " + courseComp102);
    await courseComp102.save();

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
  read,
  create,
  listByUser,
  remove,
  stat,
  courseDetails,
  updateAttendance,
  initData,
};

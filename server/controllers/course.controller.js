import course from "../models/course.model.js";
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

export default {
  courseByID,
  lessonByID,
  create,
  listByUser,
  remove,
  numLesson,
  attendanceByLesson,
  updateAttendanceByLesson,
};

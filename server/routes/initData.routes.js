"use strict";
import express from "express";
import userCtrl from "../controllers/user.controller.js";
import courseCtrl from "../controllers/course.controller.js";

const router = express.Router();

router.param("userId", userCtrl.userByID);
router.param("courseId", courseCtrl.courseByID);
router.param("lessonId", courseCtrl.lessonByID);

// router.route("/api/users/list").get(userCtrl.list);
router.route("/api/initData/users").get(userCtrl.initData);
router.route("/api/initData/courses").get(courseCtrl.initData);
export default router;

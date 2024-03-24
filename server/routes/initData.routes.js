"use strict";
import express from "express";
import userCtrl from "../controllers/user.controller.js";
import courseCtrol from "../controllers/course.controller.js";

const router = express.Router();
// router.route("/api/users/list").get(userCtrl.list);
router.route("/api/users/initData").get(userCtrl.initData);
router.route("/api/courses/initData").get(courseCtrol.initData);
export default router;

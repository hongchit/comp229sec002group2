import express from "express";
import courseCtrl from "../controllers/course.controller.js";
import authCtrl from "../controllers/auth.controller.js";
const router = express.Router();

router.param("userId", userCtrl.userByID);
router.param("courseId", courseCtrl.courseByID);
router.param("lessonId", courseCtrl.lessonByID);

router
  .route("/api/courses/:userId/")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.create
  )
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.listByUser
  );
router
  .route("/api/courses/:userId/:courseId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, courseCtrl.numLesson)
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.remove
  );

router
  .route("/api/courses/:userId/:courseId/stat")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.stat
  );
router
  .route("/api/courses/:userId/:courseId/:lessonId")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.attendanceByLesson
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.updateAttendanceByLesson
  );

export default router;

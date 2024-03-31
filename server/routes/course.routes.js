import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";
import courseCtrl from "../controllers/course.controller.js";
const router = express.Router();

router.param("userId", userCtrl.userByID);
router.param("courseId", courseCtrl.courseByID);

// Read Course details
router.route("/api/course/:courseId").get(courseCtrl.read);
// List all the Courses in brief for the professor
router.route("/api/courses/list").get(courseCtrl.listByUser);

router
  .route("/api/user/:userId/courses/")
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

//?lessonNum  is a query parameter
router
  .route("/api/user/:userId/courses/:courseId")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.courseDetails
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.remove
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.update
  );

router
  .route("/api/user/:userId/courses/:courseId/stat")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.stat
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    authCtrl.requireProfessorRole,
    courseCtrl.updateAttendance
  );

export default router;

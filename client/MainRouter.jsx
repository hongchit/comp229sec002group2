// import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./core/Home";
import Users from "./user/Users.jsx";
import Signup from "./user/Signup.jsx";
import Signin from "./lib/Signin.jsx";
import Profile from "./user/Profile.jsx";
import PrivateRoute from "./lib/PrivateRoute.jsx";
import EditProfile from "./user/EditProfile.jsx";
import Courses from "./course/Courses.jsx";
import CourseSelected from "./course/CourseSelected.jsx";
import Menu from "./core/Menu";
import NewCourse from "./course/NewCourse.jsx";
import EditCourse from "./course/EditCourse.jsx";

function MainRouter() {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/user/edit/:userId"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/New" element={<NewCourse />} />
        <Route path="/course/:courseId" element={<CourseSelected />} />
        <Route path="/course/:courseId/edit" element={<EditCourse />} />
        <Route path="/course/:courseId/delete" element={<CourseSelected />} />
        <Route path="/course/:courseId/stat" element={<CourseSelected />} />
      </Routes>
    </div>
  );
}

export default MainRouter;

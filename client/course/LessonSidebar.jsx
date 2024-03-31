import React from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Box,
} from "@material-ui/core/";
import { Link } from "react-router-dom";

function LessonSidebar({ numLessons, courseId }) {
  // Create an array of lessons based on numLessons
  const lessons = Array.from(
    { length: Number(numLessons) },
    (_, index) => `Lesson ${index + 1}`
  );

  return (
    <Box component="nav" sx={{ width: 150, flexShrink: { md: 0 } }}>
      <List>
        {lessons.map((text, index) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={`/course/${courseId}?lessonNum=${index + 1}`}
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
LessonSidebar.propTypes = {
  numLessons: PropTypes.number.isRequired,
};
export default LessonSidebar;
/*
    <Drawer variant="permanent" anchor="left">
      <Toolbar />
      <List>
        {lessons.map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
*/

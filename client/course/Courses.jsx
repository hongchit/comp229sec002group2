"use strict";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import auth from "../lib/auth-helper.js";
import { list } from "../lib/api-course.js";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
// import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme) => ({
  gridList: {
    width: "90%",
    marginLeft: "auto !important",
    marginRight: "auto !important",
  },
  card: {
    // Define your card styles here
    width: "80%",
    height: "80%",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardcontent: {},
  textField: {
    // Define your text field styles here
  },
  error: {
    // Define your error icon styles here
  },
  submit: {
    // Define your submit button styles here
  },
  title: {
    // Define your title styles here
  },
  root: {
    // Define your root styles here
    // display: "flex",
    // flexDirection: "column",
    // flexWrap: "wrap",
    // justifyContent: "space-around",
  },
}));
export default function Courses() {
  let currentUserInfo = auth.isAuthenticated();

  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    list(currentUserInfo, signal).then((data) => {
      console.log(data);
      if (data && data.error) {
        console.log(data.error);
      } else {
        console.log(data);
        setCourses(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={0}>
      <Typography variant="h6" className={classes.title}>
        My Courses
      </Typography>

      <GridList cellHeight={160} className={classes.gridList} cols={4}>
        {courses.map((item, i) => {
          return (
            <GridListTile key={item.i}>
              <Link component={RouterLink} to={"/course/" + item._id} key={i}>
                <Card className={classes.card} elevation={4}>
                  <CardContent className={classes.cardcontent}>
                    <Typography variant="h5" component="h2">
                      {item.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </GridListTile>
          );
        })}
      </GridList>
    </Paper>
  );
}

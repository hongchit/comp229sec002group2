import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import auth from "../lib/auth-helper.js";
import { getCourse, remove } from "../lib/api-course.js";
import { Navigate } from "react-router-dom";

export default function DeleteCourse(props) {
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const credentials = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };

  const [values, setValues] = useState({
    name: "",
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    getCourse(
      {
        courseId: props.courseId,
        userId: credentials.user._id,
      },
      { t: credentials.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [props.courseId, credentials.token, credentials.user._id]);

  const deleteCourse = () => {
    remove(
      {
        courseId: props.courseId,
        userId: credentials.user._id,
      },
      { t: credentials.token }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setRedirect(true);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };

  if (redirect) {
    return <Navigate to="/courses" />;
  }
  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete Course: " + values.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your course?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteCourse}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
DeleteCourse.propTypes = {
  courseId: PropTypes.string.isRequired,
};

"use strict";
import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 *
 * @param {*} req
 *      optional parameter: role
 * @param {*} res
 * @returns
 */
const list = async (req, res) => {
  try {
    let role = undefined;
    if (req.query && req.query.role) {
      role = req.query.role.trim();
    }

    let users = await User.list(role);
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.deleteOne();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Populate database with default data
const initData = async (req, res) => {
  let clear = false;
  if (req.query && req.query.clear) {
    clear = true;
  }
  if (clear) {
    await User.deleteMany();
  }

  let users = [
    {
      name: "Esther",
      lastName: "Barrera",
      email: "esther@professor.com",
      phone: "123-456-7890",
      user_role: User.Role.PROFESSOR,
    },
    {
      name: "Madison",
      lastName: "Stanley",
      email: "madison@professor.com",
      phone: "987-654-3210",
      user_role: User.Role.PROFESSOR,
    },
    {
      name: "Tahlia",
      lastName: "Carey",
      email: "tahlia@professor.com",
      phone: "132-465-8790",
      user_role: User.Role.PROFESSOR,
    },
    {
      name: "Gloria",
      lastName: "Boyer",
      email: "gloria@student.com",
      phone: "",
      user_role: User.Role.STUDENT,
    },
    {
      name: "Wilson",
      lastName: "Banks",
      email: "wilson@student.com",
      phone: "222-333-4455",
      user_role: User.Role.STUDENT,
    },
    {
      name: "Cynthia",
      lastName: "Santos",
      email: "cynthia@student.com",
      phone: "647-493-5628",
      user_role: User.Role.STUDENT,
    },
  ];

  let totalCreated = 0;
  let skipped = 0;
  for (let user of users) {
    try {
      let existing = !clear || (await User.findByName(user.name));
      if (existing) {
        skipped++;
      } else {
        await new User({
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          password: user.name.toLowerCase(),
          user_role: user.user_role,
        }).save();
        totalCreated++;
      }
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }

  return res.status(200).json({
    message:
      totalCreated +
      " users created in database. " +
      skipped +
      " existing records skipped.",
  });
};

export default { create, userByID, read, list, remove, update, initData };

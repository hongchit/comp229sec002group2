"use strict";
import { Schema, model } from "mongoose";
import crypto from "crypto";

/**
 * Enum (class) for user role
 */
class Role {
  static PROFESSOR = "professor";
  static STUDENT = "student";

  /**
   * Check if the role is a valid value
   * @param {string} role
   * @returns
   */
  static isValid(role) {
    return role == Role.PROFESSOR || role == Role.STUDENT;
  }
}

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    unique: "Email already exists", // Unique is index only, not validation
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  lastName: {  // New lastname field
    type: String,
    trim: true,
    required: 'Last name is required'
  },
  phone: {  // New phone field
    type: String,
    trim: true,
    required: 'Phone number is required'
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,

  confirmPassword: {  // New confirmPassword field
    type: String,
    required: 'Confirm password is required'
  },

  user_role: {
    type: String,
    default: "student",
    enum: [Role.PROFESSOR, Role.STUDENT],
  },
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
    //this.hashed_password = password;

    //this.salt = this.makeSalt();
    //this.hashed_password = password;
    //this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);
UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  isProfessor: function () {
    return this.user_role == Role.PROFESSOR;
  },
  isStudent: function () {
    return this.user_role == Role.STUDENT;
  },
};

const User = model("User", UserSchema);
/**
 * Expose User Role
 */
User.Role = Role;

/**
 * List users
 * @param {string} role Limit result to the specified role. Leave empty to list all users.
 * @returns Users
 */
User.list = async function (role) {
  let filter = undefined;
  if (role) {
    if (Role.isValid(role)) {
      filter = { user_role: { $eq: role } };
    } else {
      throw "Unknown user role: " + role;
    }
  }

  let users = await User.find(filter).select(
    "name email user_role updated created"
  );
  return users;
};

/**
 * Find a user by user name
 * @param {string} name
 * @returns User
 */
User.findByName = async function (name) {
  let filter = { name: { $eq: name } };
  let user = await User.findOne(filter);
  return user;
};

export default User;

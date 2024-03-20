import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, "The username is mandatory"],
  },
  firstName: {
    type: String,
    required: [true, "The first name is mandatory"],
  },
  lastName: {
    type: String,
    required: [true, "The last name is mandatory"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "The email is mandatory"],
  },
  password: {
    type: String,
    required: [true, "The password is mandatory"],
  },
  role: {
    type: String,
    required: [true, "The role is mandatory"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
  createdBy: {
    type: String,
    default: "admin",
  },
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;

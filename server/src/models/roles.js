import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  created_by: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: String,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const RoleModel = mongoose.model("roles", RoleSchema);

export default RoleModel;
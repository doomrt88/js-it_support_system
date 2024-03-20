import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  user_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: String,
  created_by: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: Number,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: [String],
    default: []
  }
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;

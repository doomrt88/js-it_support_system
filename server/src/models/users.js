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
  },
  roles: {
    type: [String],
    default: []
  },
  projects: [{ type: Schema.Types.ObjectId, ref: 'projects' }]
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;

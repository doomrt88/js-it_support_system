import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
  value: {
    type: String,
    required: true,
    maxlength: 1000
  },
  issue_number:{
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    required: true
  }
});

const CommentModel = mongoose.model("comments", CommentSchema);

export default CommentModel;
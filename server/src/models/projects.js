import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 250
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  start_date: Date,
  end_date: Date,
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

const ProjectModel = mongoose.model("projects", ProjectSchema);

export default ProjectModel;
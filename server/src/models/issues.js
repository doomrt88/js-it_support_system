import mongoose, { Schema } from "mongoose";

const IssueSchema = new mongoose.Schema({
  issue_number: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 250
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    priority: {
        type: Number,
        required: true
    },
    start_date: Date,
    due_date: Date,
    issue_type: {
      type: String,
      required: true
    },
    status: {
        type: String,
        required: true,
        maxlength: 100
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'projects',
      required: true
    },
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

IssueSchema.pre('save', async function (next) {
  try {
      if (!this.issue_number) {
          let latestIssue = await this.constructor.findOne({}, {}, { sort: { 'created_at': -1 } });
          let latestNumber = latestIssue ? parseInt(latestIssue.issue_number.split('-')[1]) + 1 : 1;
          this.issue_number = `${latestNumber}`;
      }
      next();
  } catch (error) {
      next(error);
  }
});

const IssueModel = mongoose.model('issues', IssueSchema);

export default IssueModel;

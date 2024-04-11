import express from "express";
import IssueModel from "../models/issues.js";
import { validateToken } from "../middlewares/auth.js";

const app = express();

// Get issue by id
app.get("/issues/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  IssueModel.findById(id)
    .then((issue) => {
      return response.status(200).json(issue);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding issue",
        message: error,
      });
    });
});

// Get all issues
app.get("/issues", [validateToken], async (request, response) => {
  const { page = 1, limit = 10 } = request.query;

  try {
    const currentPageNumber = parseInt(page, 10);
    const issues = await IssueModel.find()
      .populate('assigned_to')
      .populate('project')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await IssueModel.countDocuments();

    return response.status(200).json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: currentPageNumber
    });
  } catch (error) {
    return response.status(400).json({
      error: "Error finding issues",
      message: error,
    });
  }
});

app.get("/my-submitted-issues/:user_id", [validateToken], async (request, response) => {
  const userId = request.params.user_id;
  const { page = 1, limit = 10 } = request.query;

  if (userId !== request.user.id) {
    return response.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const currentPageNumber = parseInt(page, 10);
    const issues = await IssueModel.find({ created_by: userId })
      .populate('assigned_to')
      .populate('project')
      .limit(limit * 1)
      .skip((currentPageNumber - 1) * limit)
      .exec();

    const count = await IssueModel.countDocuments({ created_by: userId });

    return response.status(200).json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: currentPageNumber
    });
  } catch (error) {
    return response.status(400).json({
      error: "Error finding submitted issues",
      message: error,
    });
  }
});


app.get("/my-open-issues/:user_id", [validateToken], async (request, response) => {
  const userId = request.params.user_id;
  const { page = 1, limit = 10 } = request.query;

  if (userId !== request.user.id) {
    return response.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const currentPageNumber = parseInt(page, 10);
    const issues = await IssueModel.find({ assigned_to: userId, status: { $in: ['New', 'In Progress'] } })
      .populate('assigned_to')
      .populate('project')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await IssueModel.countDocuments({ assigned_to: userId, status: { $in: ['New', 'In Progress'] } });

    return response.status(200).json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: currentPageNumber
    });
  } catch (error) {
    return response.status(400).json({
      error: "Error finding open issues",
      message: error,
    });
  }
});


app.get("/closed-issues/:user_id", [validateToken], async (request, response) => {
  const userId = request.params.user_id;
  const { page = 1, limit = 10 } = request.query;

  if (userId !== request.user.id) {
    return response.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const currentPageNumber = parseInt(page, 10);
    const issues = await IssueModel.find({ assigned_to: userId, status: 'Closed' })
      .populate('assigned_to')
      .populate('project')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await IssueModel.countDocuments({ assigned_to: userId, status: 'Closed' });

    return response.status(200).json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: currentPageNumber
    });
  } catch (error) {
    return response.status(400).json({
      error: "Error finding closed issues",
      message: error,
    });
  }
});

// Get all open issues with pagination
app.get("/open-issues", [validateToken], async (request, response) => {
  const { page = 1, limit = 10 } = request.query;

  try {
    const currentPageNumber = parseInt(page, 10);
    const issues = await IssueModel.find({ status: { $in: ['New', 'In Progress'] } })
      .populate('assigned_to')
      .populate({
        path: 'project',
        select: '_id name'
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await IssueModel.countDocuments({ status: { $in: ['New', 'In Progress'] } });

    return response.status(200).json({
      issues,
      totalPages: Math.ceil(count / limit),
      currentPage: currentPageNumber
    });
  } catch (error) {
    return response.status(400).json({
      error: "Error finding open issues",
      message: error,
    });
  }
});


// Create issue
app.post("/issues", [validateToken], async (request, response) => {
  const newBody = { ...request.body };

  newBody.created_by = request.user.id,
  newBody.updated_by = request.user.id,
  newBody.created_at = new Date();
  newBody.updated_at = new Date();

  IssueModel.create(newBody)
    .then((issue) => {
      return response.status(201).json({
        message: "Issue created",
        issue: issue,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Database error",
        message: error,
      });
    });
});

// Delete
app.delete("/issues/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  IssueModel.findByIdAndDelete(id)
    .then((issue) => {
      if (!issue) {
        return response.status(404).json({
          error: "Issue not found",
          message: "Issue with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "Issue deleted successfully",
        issue: issue,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error deleting issue",
        message: error.message,
      });
    });
});

// Update
app.put("/issues/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  const body = request.body;
  
  if (!id || !body) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID or body provided",
    });
  }

  const newBody = { ...body };
  newBody.updated_by = request.user.id,
  newBody.updated_at = new Date();

  IssueModel.findByIdAndUpdate(id, body, { new: true })
    .then((issue) => {
      if (!issue) {
        return response.status(404).json({
          error: "Issue not found",
          message: "Issue with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "Issue updated successfully",
        issue: issue,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error updating issue",
        message: error.message,
      });
    });
});

export default app;

import express from "express";
import ProjectModel from "../models/projects.js";
import { validateToken } from "../middlewares/auth.js";

const app = express();

// Get project by id
app.get("/projects/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  ProjectModel.findById(id)
    .then((project) => {
      return response.status(200).json(project);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding project",
        message: error,
      });
    });
});

// Get all projects
app.get("/projects", [validateToken], (_, response) => {
  ProjectModel.find()
    .then((projects) => {
      return response.status(200).json(projects);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding projects",
        message: error,
      });
    });
});

// Create project
app.post("/projects", [validateToken], async (request, response) => {
  const newBody = { ...request.body };

  const nameExists = await isProjectExists(newBody.name);
  if (nameExists) {
    return response.status(400).json({
      error: "Name already exists",
      message: "The project name is already in use",
    });
  }

  newBody.created_by = request.user.id,
  newBody.updated_by = request.user.id,
  newBody.created_at = new Date();
  newBody.updated_at = new Date();

  ProjectModel.create(newBody)
    .then((project) => {
      return response.status(201).json({
        message: "Project created",
        project: project,
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
app.delete("/projects/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  ProjectModel.findByIdAndDelete(id)
    .then((project) => {
      if (!project) {
        return response.status(404).json({
          error: "Project not found",
          message: "Project with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "Project deleted successfully",
        project: project,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error deleting project",
        message: error.message,
      });
    });
});

// Update
app.put("/projects/:id", [validateToken], async (request, response) => {
  const { id } = request.params;
  const body = request.body;
  
  if (!id || !body) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID or body provided",
    });
  }

  const nameExists = await isProjectExists(body.name, id);
  if (nameExists) {
    return response.status(400).json({
      error: "Name already exists",
      message: "The project name is already in use",
    });
  }

  const newBody = { ...body };
  newBody.updated_by = request.user.id,
  newBody.updated_at = new Date();

  ProjectModel.findByIdAndUpdate(id, body, { new: true })
    .then((project) => {
      if (!project) {
        return response.status(404).json({
          error: "Project not found",
          message: "Project with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "Project updated successfully",
        project: project,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error updating project",
        message: error.message,
      });
    });
});

async function isProjectExists(name, id = null) {
  try {
    const query = { name: name };
    if (id) {
      query._id = { $ne: id };
    }
    const existingProject = await ProjectModel.findOne(query);
    return !!existingProject;
  } catch (error) {
    console.error("Error checking name:", error.message);
    return true;
  }
}

export default app;

import express from "express";
import RoleModel from "../models/roles.js";
import PermissionModel from "../models/permissions.js";
import { validateToken } from "../middlewares/auth.js";

const app = express();

// Get role by id
app.get("/roles/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  RoleModel.findById(id)
    .populate({
      path: 'permissions',
      select: '_id'
    })
    .then((role) => {
      return response.status(200).json(role);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding role",
        message: error,
      });
    });
});

// Get all roles
app.get("/roles", [validateToken], (_, response) => {
  RoleModel.find()
    .populate({
      path: 'permissions',
      select: '_id'
    })
    .then((roles) => {
      return response.status(200).json(roles);
    })
    .catch((error) => {
      console.log(error);
      return response.status(400).json({
        error: "Error finding roles",
        message: error,
      });
    });
});

// Create role
app.post("/roles", [validateToken], async (request, response) => {
  const { name, description, permissions } = request.body;
  if (!name || !permissions || !Array.isArray(permissions)) {
    return response.status(400).json({
      error: "Bad Request",
      message: "Name and permissions are required",
    });
  }

  const newBody = { ...request.body };

  newBody.created_by = request.user.id,
  newBody.updated_by = request.user.id,
  newBody.created_at = new Date();
  newBody.updated_at = new Date();

  RoleModel.create(newBody)
    .then((role) => {
      return response.status(201).json({
        message: "Role created",
        role: role,
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
app.delete("/roles/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  RoleModel.findByIdAndDelete(id)
    .then((role) => {
      if (!role) {
        return response.status(404).json({
          error: "Role not found",
          message: "Role with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "Role deleted successfully",
        role: role,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error deleting role",
        message: error.message,
      });
    });
});

// Update
app.put("/roles/:id", [validateToken], (request, response) => {
  const { name, description, permissions } = request.body;
  if (!name || !permissions || !Array.isArray(permissions)) {
    return response.status(400).json({
      error: "Bad Request",
      message: "Name and permissions are required",
    });
  }

  const { id } = request.params;
  const body = request.body;
  
  if (!id || !body) {
    // Bad request
    return response.status(400).json({
      error: "Bad Request",
      message: "No ID or body provided",
    });
  }

  const newBody = { ...body };
  newBody.updated_by = request.user.id,
  newBody.updated_at = new Date();

  RoleModel.findByIdAndUpdate(id, body, { new: true })
    .then((role) => {
      if (!role) {
        return response.status(404).json({
          error: "Role not found",
          message: "Role with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "Role updated successfully",
        role: role,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error updating role",
        message: error.message,
      });
    });
});

export default app;

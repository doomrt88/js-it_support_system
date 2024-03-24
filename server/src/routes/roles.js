import express from "express";
import RoleModel from "../models/roles.js";
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
    .then((roles) => {
      return response.status(200).json(roles);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding roles",
        message: error,
      });
    });
});

// Create role
app.post("/roles", async (request, response) => {
  RoleModel.create(request.body)
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

export default app;

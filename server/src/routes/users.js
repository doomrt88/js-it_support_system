import express from "express";
import UserModel from "../models/users.js";
import { generatePassword } from "../utils/index.js";
import { validateToken } from "../middlewares/auth.js";

const app = express();

// Get user by id
app.get("/users/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  UserModel.findById(id)
    .then((user) => {
      return response.status(200).json(user);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding user",
        message: error,
      });
    });
});

// Get all users
app.get("/users", [validateToken], (_, response) => {
  UserModel.find()
    .then((user) => {
      return response.status(200).json(user);
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error finding users",
        message: error,
      });
    });
});

// Create user
app.post("/users", async (request, response) => {
  const body = request.body;

  if (!body || !body.password) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No body provided",
    });
  }

  const password = await generatePassword(body.password);
  const newBody = { ...body, password };

  UserModel.create(newBody)
    .then((user) => {
      return response.status(201).json({
        message: "User created",
        user: user,
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

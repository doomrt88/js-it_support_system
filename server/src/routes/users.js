import express from "express";
import UserModel from "../models/users.js";
const app = express();

// Get user by id
app.get("/users/:id", (request, response) => {
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
app.get("/users", (_, response) => {

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
app.post("/users", (request, response) => {
  const body = request.body;

  if (!body) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No body provided",
    });
  }

  UserModel.create(body)
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

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
app.get("/users", [validateToken], (request, response) => {
  const { search } = request.query;
  let filter = {};
  if (search) {
    filter = {
      $or: [
        { user_name: { $regex: search, $options: "i" } },
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
      ],
    };
  }

  UserModel.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "projects",
        foreignField: "_id",
        as: "projects"
      }
    },
    {
      $project: {
        _id: 1,
        user_name: 1,
        first_name: 1,
        last_name: 1,
        roles: 1,
        projects: "$projects.name"
      }
    },
    {
      $match: filter,
    }
  ])
  .then((users) => {
    const userVM = mapToViewModel(users);
    return response.status(200).json(userVM);
  })
  .catch((error) => {
    return response.status(400).json({
      error: "Error finding users",
      message: error
    });
  });
});

// Create user
app.post("/users", [validateToken], async (request, response) => {
  const body = request.body;
  console.log(request);
  if (!body || !body.password) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No body provided",
    });
  }

  const password = await generatePassword(body.password);
  const newBody = { ...body, password };

  newBody.created_by = request.user.id,
  newBody.updated_by = request.user.id,
  newBody.created_at = new Date();
  newBody.updated_at = new Date();

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

// Delete
app.delete("/users/:id", [validateToken], (request, response) => {
  const { id } = request.params;
  if (!id) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID provided",
    });
  }

  UserModel.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return response.status(404).json({
          error: "User not found",
          message: "User with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "User deleted successfully",
        user: user,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error deleting user",
        message: error.message,
      });
    });
});

// Update
app.put("/users/:id", [validateToken], async (request, response) => {
  const { id } = request.params;
  const body = request.body;
  
  if (!id || !body) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No ID or body provided",
    });
  }

  const password = await generatePassword(body.password);
  const newBody = { ...body, password };
  
  newBody.updated_by = request.user.id,
  newBody.updated_at = new Date();

  UserModel.findByIdAndUpdate(id, newBody, { new: true })
    .then((user) => {
      if (!user) {
        return response.status(404).json({
          error: "User not found",
          message: "User with provided ID not found",
        });
      }
      return response.status(200).json({
        message: "User updated successfully",
        user: user,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        error: "Error updating user",
        message: error.message,
      });
    });
});

function mapToViewModel(users) {
  return users.map(user => ({
    id: user._id.toString(),
    user_name: user.user_name,
    friendly_name: `${user.first_name} ${user.last_name}`,
    roles: user.roles.map(role => role).join(", "),
    projects: user.projects.map(project => project).join(", ") 
  }));
}

export default app;

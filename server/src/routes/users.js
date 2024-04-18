import express from "express";
import UserModel from "../models/users.js";
import RoleModel from "../models/roles.js";
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
  .populate({
    path: 'projects',
    select: '_id name' 
  })
  .populate('roles') 
  .then((user) => {
    if (!user) {
      return response.status(404).json({
        error: "User not found",
        message: "User with the provided ID does not exist",
      });
    }
    return response.status(200).json(user);
  })
  .catch((error) => {
    return response.status(400).json({
      error: "Error finding user",
      message: error.message,
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

  const usernameTaken = await isUsernameTaken(body.user_name);
  if (usernameTaken) {
    return response.status(400).json({
      error: "Username already exists",
      message: "The username is already in use",
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

// Create user
app.post("/users/registration", async (request, response) => {
  const body = request.body;
  console.log(request);
  if (!body || !body.password) {
    // Bad request
    return response.status(400).json({
      error: "bad request",
      message: "No body provided",
    });
  }

  const usernameTaken = await isUsernameTaken(body.user_name);
  if (usernameTaken) {
    return response.status(400).json({
      error: "Username already exists",
      message: "The username is already in use",
    });
  }
  
  if(body.password !== body.confirmPassword){
    return response.status(400).json({
      error: "Passwords don't match",
      message: "Passwords don't match",
    });
  }

  const password = await generatePassword(body.password);
  const newBody = { ...body, password };

  newBody.created_at = new Date();
  newBody.updated_at = new Date();
  newBody.roles = [];
  newBody.roles.push('Basic Role');

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

  const usernameTaken = await isUsernameTaken(body.user_name, id);
  if (usernameTaken) {
    return response.status(400).json({
      error: "Username already exists",
      message: "The username is already in use",
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

// Get user permissions by user id
app.get("/users/:id/permissions", [validateToken], async (request, response) => {
  const { id } = request.params;
    if (!id) {
        // Bad request
        return response.status(400).json({
            error: "bad request",
            message: "No ID provided",
        });
    }

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return response.status(404).json({
                error: "User not found",
                message: "User with the provided ID does not exist",
            });
        }

        // Fetch roles based on role names associated with the user
        const roles = await RoleModel.find({ name: { $in: user.roles } }).populate('permissions');
        
        console.log(roles);

        const permissions = roles.reduce((acc, role) => {
          return acc.concat(role.permissions.map(permission => permission.code));
      }, []);

        console.log(permissions);
        return response.status(200).json(permissions);
    } catch (error) {
        return response.status(400).json({
            error: "Error finding user permissions",
            message: error.message,
        });
    }
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

async function isUsernameTaken(username, userId = null) {
  try {
    const query = { user_name: username };
    if (userId) {
      query._id = { $ne: userId };
    }
    const existingUser = await UserModel.findOne(query);
    return !!existingUser;
  } catch (error) {
    console.error("Error checking username:", error.message);
    return true;
  }
}



export default app;

import express from "express";
import UserModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ user_name: username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const newUser = {
      id: user._id,
      userName: user.user_name,
      firstName: user.first_name,
      lastName: user.last_name,
      roles: user.roles
    };

    const token = jwt.sign(newUser, process.env.JWT_SEED);

    res.json({ message: "Login successful", user: newUser, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default app;

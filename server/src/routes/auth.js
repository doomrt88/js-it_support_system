import express from "express";
import UserModel from "../models/users.js";
import bcrypt from "bcrypt";

const app = express();

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await UserModel.findOne({ user_name: username });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    res.json({ msg: 'Login successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default app;

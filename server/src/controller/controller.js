import express from "express";
import auth from "../routes/auth.js";
import tickets from "../routes/tickets.js";
import users from "../routes/users.js";

const app = express();

app.use(auth);
app.use(tickets);
app.use(users);

export default app;

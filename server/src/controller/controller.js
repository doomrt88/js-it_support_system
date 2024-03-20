import express from "express";
import tickets from "../routes/tickets.js";
import users from "../routes/users.js";

const app = express();

app.use(tickets);
app.use(users);

export default app;

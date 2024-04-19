import express from "express";
import auth from "../routes/auth.js";
import tickets from "../routes/tickets.js";
import users from "../routes/users.js";
import roles from "../routes/roles.js";
import projects from '../routes/projects.js';
import permissions from '../routes/permissions.js';
import issues from '../routes/issues.js';
import comment from '../routes/comments.js';

const app = express();

app.use(auth);
app.use(tickets);
app.use(users);
app.use(roles);
app.use(projects);
app.use(permissions);
app.use(issues);
app.use(comment);

export default app;

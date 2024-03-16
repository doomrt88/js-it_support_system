import express from "express";

const app = express();

app.get("/users", (request, response) => {
  response.send("<strong>USER</strong>");
});

app.post("/users", (request, response) => {
  const body = request.body;
  if (!body) {
    response
      .status(400)
      .json({ error: "bad request", message: "no body provided" });
    return;
  }

  response.status(201).json({ user: body });
});

export default app;

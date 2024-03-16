import express from "express";

const app = express();

app.get("/tickets", (request, response) => {
  const echo = request.query.echo;
  response.status(200).json({
    message: echo,
  });
});

export default app;

import express from "express";
import controller from "./src/controller/controller.js";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 3000;

mongoose
  .connect("mongodb://localhost:28000", {
    user: "admin",
    pass: "secureadmin",
    dbName: "support",
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(express.json());
app.use(controller);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

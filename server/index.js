import express from "express";
import controller from "./src/controller/controller.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(controller);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

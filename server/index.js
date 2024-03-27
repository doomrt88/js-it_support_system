import express from "express";
import controller from "./src/controller/controller.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// USE when running with docker
//const mongodbConnString = 'mongodb://db:27017';
// const mongodbConnString = 'mongodb://localhost:27017';

// // connect through mongodb server with docker
// mongoose.connect(mongodbConnString, {
//     user: "admin",
//     pass: "secureadmin",
//     dbName: "support",
//   })
//   .then(() => {
//     console.log("Database connected");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

console.log(process.env.ENABLE_DOCKER == 'true');
const mongodbConnString = process.env.ENABLE_DOCKER == 'true' ? `mongodb://db:27017` : `mongodb://${process.env.MONGO_INITDB_HOST}:${process.env.MONGO_INITDB_PORT}`;
console.log(mongodbConnString);

mongoose.connect(mongodbConnString, {
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    dbName: process.env.MONGO_INITDB_DATABASE,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

// Connect to MongoDB using Mongoose
// mongoose.connect(mongodbConnString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => {
//   console.log("Database connected");
// })
// .catch((err) => {
//   console.error(err);
// });

// use this to connect to a local mongodb server
// DB URIs here
// const mongodbConnString = 'mongodb://localhost:27017';

// // Connect to MongoDB
// mongoose
//   .connect(mongodbConnString, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "itsm" })
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));


// const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// app.use(cors({
//   origin: allowedOrigins
// }));

app.use(cors());
app.use(express.json());
app.use(controller);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

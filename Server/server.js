import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());

const PORT = 4001;

// Database connect
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

import customerControllers from "./Controllers/customerController.js";
import merchantControllers from "./Controllers/merchantController.js";

app.use('/api/customers', customerControllers);
app.use('/api/merchants', merchantControllers);

app.get("/", (req, res) => {
  res.send("Hello, QS!!!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const port = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};
app.listen(port, () => {
  connect();
  console.log("Server running on port 3000");
});

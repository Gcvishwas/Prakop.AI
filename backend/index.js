import express from "express";
import cors from "cors";
const port = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.listen(port, () => {
  console.log("Server running on port 3000");
});

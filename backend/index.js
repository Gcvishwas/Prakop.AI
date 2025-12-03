import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
const port = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};
app.post("/api/chats", async (req, res) => {
  const { userId, text } = req.body;
  try {
    // Create a new chat
    const newChat = new Chat({
      userId: userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });
    const saveChat = await newChat.save(); //gives _id used in UserChats

    // Check if user exists
    const userChatDocs = await UserChats.find({ userId });

    if (!userChatDocs.length) {
      const newUserChat = new UserChats({
        userId: userId,
        chats: [
          {
            _id: saveChat.id,
            title: text.substring(0, 40),
          },
        ],
      });
      await newUserChat.save();
    } else {
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: saveChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    res.status(201).send(saveChat._id);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating your chat");
  }
});
app.listen(port, () => {
  connect();
  console.log("Server running on port 3000");
});

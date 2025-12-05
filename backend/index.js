import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
const port = process.env.PORT || 3000;
const app = express();
app.use(clerkMiddleware());

app.use(
  cors({
    origin: "https://prakop-ai.vercel.app",
    credentials: true, // <--- this is required for cookies/auth
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

app.post("/api/chats", requireAuth(), async (req, res) => {
  const userId = req.auth().userId;
  const { text } = req.body;
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
            _id: saveChat._id,
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
    res.status(201).send(newChat._id);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating your chat");
  }
});

app.get("/api/userChats", requireAuth(), async (req, res) => {
  const userId = req.auth().userId;
  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching the UserChats");
  }
});

app.get("/api/chat/:id", requireAuth(), async (req, res) => {
  const userId = req.auth().userId;
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error displaying chat");
  }
});
app.put("/api/chat/:id", requireAuth(), async (req, res) => {
  const userId = req.auth().userId;
  const { question, answer } = req.body;

  // Build newItems conditionally. Do NOT push an empty model message.
  const newItems = [];
  if (typeof question !== "undefined" && question !== null) {
    newItems.push({ role: "user", parts: [{ text: question }] });
  }
  if (typeof answer !== "undefined" && answer !== null) {
    // Only push model message when there's a real answer
    newItems.push({ role: "model", parts: [{ text: answer }] });
  }

  if (newItems.length === 0) {
    return res.status(400).send("Nothing to update");
  }

  try {
    const updateChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updateChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating conversation");
  }
});
app.listen(port, () => {
  connect();
  console.log("Server running on port 3000");
});

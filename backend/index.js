import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await mongoose.connection.db
      .collection("emergency-contacts")
      .find({})
      .toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching the contacts");
  }
});
app.use(clerkMiddleware());
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
  }
};
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

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
  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }] }] : []),
    { role: "model", parts: [{ text: answer }] },
  ];

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
app.delete("/api/chat/:id", requireAuth(), async (req, res) => {
  const userId = req.auth().userId;
  const chatId = req.params.id;
  try {
    await Chat.deleteOne({ _id: chatId, userId });
    const updateUserChat = await UserChats.updateOne(
      { userId },
      {
        $pull: {
          chats: {
            _id: chatId,
          },
        },
      }
    );
    res.status(200).send(updateUserChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting");
  }
});
app.listen(port, () => {
  connect();
  console.log("Server running on port 3000");
});

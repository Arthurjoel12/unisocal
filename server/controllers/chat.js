import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "name pic email");

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId]
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password");

      res.status(200).send(fullChat);
    }
  } catch (error) {
    res.status(400).send({ message: "Failed to access the chat" });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const populatedResults = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email"
    });

    res.status(200).send(populatedResults);
  } catch (error) {
    res.status(400).send({ message: "Failed to fetch chats" });
  }
};

export const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = req.body.users;
  if (typeof users === "string") {
    try {
      users = JSON.parse(users);
    } catch (error) {
      return res.status(400).send({ message: "Invalid users data" });
    }
  }

  if (!Array.isArray(users) || users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users required for a group chat" });
  }

  users.push(req.user); // Add the current user who is creating the group chat.

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({ message: "Failed to create the group chat" });
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404).send({ message: "Chat not found" });
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    res.status(400).send({ message: "Failed to rename the group" });
  }
};

export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404).send({ message: "Chat not found" });
    } else {
      res.json(removed);
    }
  } catch (error) {
    res.status(400).send({ message: "Failed to remove from the group" });
  }
};

export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404).send({ message: "Chat not found" });
    } else {
      res.json(added);
    }
  } catch (error) {
    res.status(400).send({ message: "Failed to add to the group" });
  }
};

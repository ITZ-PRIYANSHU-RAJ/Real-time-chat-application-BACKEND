import mongoose from "mongoose";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";

const basePopulate = [
  { path: "participants", select: "-password" },
  { path: "groupAdmin", select: "-password" },
  {
    path: "lastMessage",
    populate: { path: "sender", select: "name email avatar" },
  },
];

export const accessDirectChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  let chat = await Chat.findOne({
    isGroupChat: false,
    participants: {
      $all: [req.user._id, new mongoose.Types.ObjectId(userId)],
    },
  }).populate(basePopulate);

  if (!chat) {
    chat = await Chat.create({
      participants: [req.user._id, userId],
    });
    chat = await Chat.findById(chat._id).populate(basePopulate);
  }

  res.json(chat);
};

export const getChats = async (req, res) => {
  const chats = await Chat.find({
    participants: req.user._id,
  })
    .populate(basePopulate)
    .sort({ updatedAt: -1 });

  const chatsWithUnread = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        readBy: { $ne: req.user._id },
        sender: { $ne: req.user._id },
      });

      return {
        ...chat.toObject(),
        unreadCount,
      };
    })
  );

  res.json(chatsWithUnread);
};

export const createGroupChat = async (req, res) => {
  const { name, participantIds = [] } = req.body;

  const memberSet = Array.from(new Set([...participantIds, String(req.user._id)]));
  if (!name || memberSet.length < 3) {
    return res
      .status(400)
      .json({ message: "Group name and at least 2 other members are required" });
  }

  const chat = await Chat.create({
    name,
    isGroupChat: true,
    participants: memberSet,
    groupAdmin: req.user._id,
  });

  const populated = await Chat.findById(chat._id).populate(basePopulate);
  res.status(201).json(populated);
};

export const updateGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const { name, participantIds } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({ message: "Group chat not found" });
  }

  if (String(chat.groupAdmin) !== String(req.user._id)) {
    return res.status(403).json({ message: "Only admin can update the group" });
  }

  if (name) chat.name = name;
  if (participantIds?.length) {
    chat.participants = Array.from(
      new Set([...participantIds, String(req.user._id)])
    );
  }

  await chat.save();
  const populated = await Chat.findById(chat._id).populate(basePopulate);
  res.json(populated);
};

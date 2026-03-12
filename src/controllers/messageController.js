import path from "path";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { inferAttachmentKind } from "../utils/chat.js";

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 });

  await Message.updateMany(
    { chat: chatId, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  res.json(messages);
};

export const createMessage = async (req, res) => {
  const { chatId, text = "" } = req.body;

  if (!chatId || (!text.trim() && !req.files?.length)) {
    return res.status(400).json({ message: "Message content is required" });
  }

  const attachments =
    req.files?.map((file) => ({
      url: `/uploads/${path.basename(file.path)}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      kind: inferAttachmentKind(file.mimetype),
    })) || [];

  const message = await Message.create({
    chat: chatId,
    sender: req.user._id,
    text,
    attachments,
    readBy: [req.user._id],
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id }, { new: true });

  const populated = await Message.findById(message._id).populate(
    "sender",
    "name email avatar"
  );

  res.status(201).json(populated);
};

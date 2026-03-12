import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    url: String,
    originalName: String,
    mimeType: String,
    size: Number,
    kind: {
      type: String,
      enum: ["image", "video", "document"],
      required: true,
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

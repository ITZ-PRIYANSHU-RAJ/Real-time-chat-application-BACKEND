import path from "path";
import { User } from "../models/User.js";

export const searchUsers = async (req, res) => {
  const search = req.query.search?.trim();
  const filter = search
    ? {
        _id: { $ne: req.user._id },
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : { _id: { $ne: req.user._id } };

  const users = await User.find(filter).select("-password").limit(20);
  res.json(users);
};

export const updateProfile = async (req, res) => {
  const { name, bio } = req.body;
  const update = {
    ...(name ? { name } : {}),
    ...(bio ? { bio } : {}),
  };

  if (req.file) {
    update.avatar = `/uploads/${path.basename(req.file.path)}`;
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
  }).select("-password");

  res.json(user);
};

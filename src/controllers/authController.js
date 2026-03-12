import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { createToken } from "../utils/tokens.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    token: createToken(user._id),
    user: user.toJSON(),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: createToken(user._id),
    user: user.toJSON(),
  });
};

export const me = async (req, res) => {
  res.json(req.user);
};

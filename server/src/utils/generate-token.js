import jwt from "jsonwebtoken";
import { env } from "./env.js";

const JWT_SECRET = env.JWT_SECRET;

export function generateToken(userId) {
  return jwt.sign({ _id: userId, purpose: "authentication" }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

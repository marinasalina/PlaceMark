import jwt from "jsonwebtoken";
import { db } from "../models/db.js";

// Create a JWT for a user
export function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

// Decode and verify a JWT
export function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log("Invalid token:", err.message);
    return null;
  }
}
// Validate a decoded JWT (used by Hapi auth strategy)
export async function validate(decoded, request) {
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}

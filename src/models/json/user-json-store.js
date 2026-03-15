import { v4 } from "uuid";
import { db } from "./store-utils.js";
// JSON-based data store for users (used instead of a real database)
export const userJsonStore = {
  // Return all users in the store
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },
  // Add a new user and assign a unique ID
  async addUser(user) {
    await db.read();
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    return user;
  },
  // Find a user by their ID
  async getUserById(id) {
    await db.read();
    let u = db.data.users.find((user) => user._id === id);
    if (u === undefined) u = null;
    return u;
  },
  // Find a user by their email address
  async getUserByEmail(email) {
    await db.read();
    let u = db.data.users.find((user) => user.email === email);
    if (u === undefined) u = null;
    return u;
  },
  // Delete a user by their ID
  async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if (index !== -1) db.data.users.splice(index, 1);
    await db.write();
  },
  // Remove all users from the store
  async deleteAll() {
    await db.read();
    db.data.users = [];
    await db.write();
  },
};

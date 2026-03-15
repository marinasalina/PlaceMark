import { v4 } from "uuid";

let users = [];
// In‑memory data store for users (used for testing or temporary storage)
export const userMemStore = {
  // Return all users currently stored in memory
  async getAllUsers() {
    return users;
  },
  // Add a new user and assign a unique ID
  async addUser(user) {
    user._id = v4();
    users.push(user);
    return user;
  },
  // Find a user by their ID
  async getUserById(id) {
    let u = users.find((user) => user._id === id);
    if (u === undefined) u = null;
    return u;
  },
  // Find a user by their email address
  async getUserByEmail(email) {
    let u = users.find((user) => user.email === email);
    if (u === undefined) u = null;
    return u;
  },
  // Delete a user by their ID
  async deleteUserById(id) {
    const index = users.findIndex((user) => user._id === id);
    if (index !== -1) {
      users.splice(index, 1);
    }
  },
  // Remove all users from memory
  async deleteAll() {
    users = [];
  },
};

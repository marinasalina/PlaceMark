import Mongoose from "mongoose";
import { User } from "./user.js";
// MongoDB store for users using Mongoose models
export const userMongoStore = {
  // Return all users from the database
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },
  // Find a user by their MongoDB ObjectId
  async getUserById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const user = await User.findOne({ _id: id }).lean();
      return user;
    }
    return null;
  },
  // Add a new user and return the saved user object
  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },
  // Find a user by their email address
  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
  },
  // Delete a user by their ID
  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },
  // Remove all users from the database
  async deleteAllUsers() {
    await User.deleteMany({});
  },

  //update user
  async updateUser(id, updatedFields) {
    if (!Mongoose.isValidObjectId(id)) {
      return null;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    }).lean();
    return updatedUser;
  },
};

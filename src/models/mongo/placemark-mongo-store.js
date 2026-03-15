import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";
// MongoDB store for placemarks using Mongoose models
export const placemarkMongoStore = {
  // Return all placemarks from the database
  async getAllPlacemarks() {
    return Placemark.find().lean();
  },
  // Find a placemark by its MongoDB ObjectId
  async getPlacemarkById(id) {
    if (!Mongoose.isValidObjectId(id)) return null;
    return Placemark.findById(id).lean();
  },
  // Add a new placemark linked to a specific user
  async addPlacemark(userId, placemark) {
    console.log("Saving placemark for user:", userId);
    const newPlacemark = new Placemark({
      ...placemark,
      userId: userId,
    });
    const savedPlacemark = await newPlacemark.save();
    return this.getPlacemarkById(savedPlacemark._id);
  },
  // Get placemarks for a user filtered by category
  async getPlacemarksByUserIdAndCategory(userId, category) {
    return Placemark.find({ userId: userId, category: category }).lean();
  },
  // Get all placemarks belonging to a specific user
  async getUserPlacemarks(userId) {
    return Placemark.find({ userId }).lean();
  },
  async getPlacemarksByUserId(userId) {
    return Placemark.find({ userId }).lean();
  },

  // Delete a single placemark by its ID
  async deletePlacemark(id) {
    if (!Mongoose.isValidObjectId(id)) return;
    await Placemark.deleteOne({ _id: id });
  },
  // Remove all placemarks from the database
  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },
};

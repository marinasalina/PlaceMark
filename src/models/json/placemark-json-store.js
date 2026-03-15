import { v4 } from "uuid";
import { db } from "./store-utils.js";
// JSON-based data store for placemarks (used instead of a real database)
export const placemarkJsonStore = {
  // Return all placemarks in the store
  async getAllPlacemarks() {
    await db.read();
    return db.data.placemarks;
  },

  // Add a new placemark for a specific user
  async addPlacemark(userId, placemark) {
    await db.read();
    const newPlacemark = {
      ...placemark,
      _id: v4(), // generate unique ID
      userId: userId, // link placemark to user
    };
    db.data.placemarks.push(newPlacemark);
    await db.write();
    return newPlacemark;
  },
  // Find a single placemark by its ID
  async getPlacemarkById(id) {
    await db.read();
    return db.data.placemarks.find((placemark) => placemark._id === id) || null;
  },
  // Get all placemarks belonging to a specific user
  async getUserPlacemarks(userId) {
    await db.read();
    return db.data.placemarks.filter(
      (placemark) => placemark.userId === userId,
    );
  },

  // Same as above — get placemarks by user ID
  async getPlacemarksByUserId(userId) {
    await db.read();
    return db.data.placemarks.filter(
      (placemark) => placemark.userId === userId,
    );
  },

  // Delete a single placemark by its ID
  async deletePlacemark(id) {
    await db.read();
    const index = db.data.placemarks.findIndex(
      (placemark) => placemark._id === id,
    );
    if (index !== -1) {
      db.data.placemarks.splice(index, 1);
      await db.write();
    }
  },

  // Remove all placemarks from the store
  async deleteAllPlacemarks() {
    await db.read();
    db.data.placemarks = [];
    await db.write();
  },
};

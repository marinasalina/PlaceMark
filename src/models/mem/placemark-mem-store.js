import { v4 } from "uuid";

let placemarks = [];
// In‑memory data store for placemarks
export const placemarkMemStore = {
  // Return all placemarks in memory
  async getAllPlacemarks() {
    return placemarks;
  },
  // Add a new placemark for a specific user
  async addPlacemark(userId, placemark) {
    const newPlacemark = {
      ...placemark,
      _id: v4(), // generate unique ID
      userId: userId, // link placemark to user
    };
    placemarks.push(newPlacemark);
    return newPlacemark;
  },
  // Find a placemark by its ID
  async getPlacemarkById(id) {
    return placemarks.find((placemark) => placemark._id === id) || null;
  },
  // Get all placemarks belonging to a specific user
  async getPlacemarksByUserId(userId) {
    return placemarks.filter((placemark) => placemark.userId === userId);
  },
  // Delete a single placemark by ID
  async deletePlacemark(id) {
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) {
      placemarks.splice(index, 1);
    }
  },
  // Remove all placemarks from memory
  async deleteAllPlacemarks() {
    placemarks = [];
  },
};

import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const placemarkJsonStore = {
  async getAllPlacemarks() {
    await db.read();
    return db.data.placemarks;
  },

  async addPlacemark(userId, placemark) {
    await db.read();
    const newPlacemark = {
      ...placemark,
      _id: v4(),
      userId: userId,
    };
    db.data.placemarks.push(newPlacemark);
    await db.write();
    return newPlacemark;
  },

  async getPlacemarkById(id) {
    await db.read();
    return db.data.placemarks.find((placemark) => placemark._id === id) || null;
  },
  getUserPlacemarks(userId) {
    return this.placemarks.filter((placemark) => placemark.userId === userId);
  },

  async getPlacemarksByUserId(userId) {
    await db.read();
    return db.data.placemarks.filter(
      (placemark) => placemark.userId === userId,
    );
  },

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

  async deleteAllPlacemarks() {
    await db.read();
    db.data.placemarks = [];
    await db.write();
  },
};

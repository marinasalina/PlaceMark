import { v4 } from "uuid";

let placemarks = [];

export const placemarkMemStore = {
  async getAllPlacemarks() {
    return placemarks;
  },

  async addPlacemark(userId, placemark) {
    const newPlacemark = {
      ...placemark,
      _id: v4(),
      userId: userId,
    };
    placemarks.push(newPlacemark);
    return newPlacemark;
  },

  async getPlacemarkById(id) {
    return placemarks.find((placemark) => placemark._id === id) || null;
  },

  async getPlacemarksByUserId(userId) {
    return placemarks.filter((placemark) => placemark.userId === userId);
  },

  async deletePlacemark(id) {
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) {
      placemarks.splice(index, 1);
    }
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  },
};

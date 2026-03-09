import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    return Placemark.find().lean();
  },

  async getPlacemarkById(id) {
    if (!Mongoose.isValidObjectId(id)) return null;
    return Placemark.findById(id).lean();
  },

  async addPlacemark(userId, placemark) {
    const newPlacemark = new Placemark({
      ...placemark,
      userId: userId,
    });
    const savedPlacemark = await newPlacemark.save();
    return this.getPlacemarkById(savedPlacemark._id);
  },

  async getPlacemarksByUserId(userId) {
    return Placemark.find({ userId }).lean();
  },

  async deletePlacemark(id) {
    if (!Mongoose.isValidObjectId(id)) return;
    await Placemark.deleteOne({ _id: id });
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },
};

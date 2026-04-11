import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    return Placemark.find({ isPrivate: false }).lean();
  },

  async getPlacemarkById(id) {
    if (!Mongoose.isValidObjectId(id)) return null;
    return Placemark.findById(id).lean();
  },

  // Find existing public POI
  async findByNameAndLocation(title, latitude, longitude) {
    return Placemark.findOne({ title, latitude, longitude }).lean();
  },

  //  Add placemark with duplicate check
  async addPlacemark(userId, placemark) {
    // Check if public POI already exists
    const existing = await Placemark.findOne({
      title: placemark.title,
      latitude: placemark.latitude,
      longitude: placemark.longitude,
    });

    if (existing) {
      console.log("Public POI already exists — reusing:", existing._id);
      return existing; // Reuse existing placemark
    }

    //   create a new public POI
    console.log("Creating NEW public POI for user:", userId);

    const newPlacemark = new Placemark({
      ...placemark,
      userId: userId,
      isPrivate: false, // PUBLIC
    });

    const savedPlacemark = await newPlacemark.save();
    return this.getPlacemarkById(savedPlacemark._id);
  },

  async getPlacemarksByUserIdAndCategory(userId, category) {
    return Placemark.find({ userId: userId, category: category }).lean();
  },

  async getUserPlacemarks(userId) {
    return Placemark.find({ userId }).lean();
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

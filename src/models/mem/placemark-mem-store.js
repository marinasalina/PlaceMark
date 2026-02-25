import { v4 } from "uuid";

let placemarks = [];

export const placemarkMemStore = {
  async getAllPlaylists() {
    return placemarks;
  },

  async addPlacemark(placemark) {
    placemark._id = v4();
    placemarks.push(placemark);
    return placemark;
  },

  async getPlacemarklistById(id) {
    const list = placemarks.find((placemark) => placemark._id === id);
    return list;
  },
  async deletePlacemarklistById(id) {
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    placemarks.splice(index, 1);
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  },

  async getUserPlacemarklists(userid) {
    return placemarks.filter((placemark) => placemark.userid === userid);
  },
};

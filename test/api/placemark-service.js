import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const placemarkService = {
  placemarkUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.placemarkUrl}/api/users`, user);
    return res.data;
  },
  async getUser(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.placemarkUrl}/api/users`);
    return res.data;
  },
  async createPlacemarklist(placemarklist) {
    const res = await axios.post(
      `${this.placemarkUrl}/api/placemarklists`,
      placemarklist,
    );
    return res.data;
  },

  async deleteAllPlacemaklists() {
    const response = await axios.delete(
      `${this.placemarkUrl}/api/placemarklists`,
    );
    return response.data;
  },

  async deletePlacemarklist(id) {
    const response = await axios.delete(
      `${this.placemarkUrl}/api/placemarklists/${id}`,
    );
    return response;
  },

  async getAllPlacemarklists() {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarklists`);
    return res.data;
  },

  async getPlacemarklist(id) {
    const res = await axios.get(
      `${this.placemarkeUrl}/api/placemarklists/${id}`,
    );
    return res.data;
  },
};

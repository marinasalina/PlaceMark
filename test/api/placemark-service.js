import axios from "axios";
import { serviceUrl } from "../fixtures.js";
// Service object for making API requests to the Placemark backend
export const placemarkService = {
  placemarkUrl: serviceUrl,
  // Create a new user
  async createUser(user) {
    const res = await axios.post(`${this.placemarkUrl}/api/users`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },
  // Get a user by ID
  async getUser(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },
  // Get all users
  async getAllUsers() {
    const res = await axios.get(`${this.placemarkUrl}/api/users`);
    return res.data;
  },
  // Delete all users
  async deleteAllUsers() {
    const res = await axios.delete(`${this.placemarkUrl}/api/users`);
    return res.data;
  },
  // Create a new placemark
  async createPlacemark(placemark) {
    const res = await axios.post(
      `${this.placemarkUrl}/api/placemarks`,
      placemark,
      { headers: { "Content-Type": "application/json" } },
    );
    return res.data;
  },
  // Delete all placemarks
  async deleteAllPlacemarks() {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },
  // Delete a single placemark by ID
  async deletePlacemark(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemarks/${id}`);

    return res;
  },
  // Get all placemarks
  async getAllPlacemarks() {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },
  // Get a single placemark by ID
  async getPlacemark(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks/${id}`);
    return res.data;
  },
  // Authenticate a user and store the JWT token for future requests
  async authenticate(user) {
    const response = await axios.post(
      `${this.placemarkUrl}/api/users/authenticate`,
      user,
    );

    axios.defaults.headers.common["Authorization"] =
      "Bearer " + response.data.token;
    return response.data;
  },
  // Clear stored authentication token
  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  },
  async addReview(placemarkId, review) {
    const res = await axios.post(
      `${this.placemarkUrl}/api/placemarks/${placemarkId}/reviews`,
      review,
      { headers: { "Content-Type": "application/json" } },
    );
    return res.data;
  },

  async getReviews(placemarkId) {
    const res = await axios.get(
      `${this.placemarkUrl}/api/placemarks/${placemarkId}/reviews`,
    );
    return res.data;
  },

  async deleteAllReviews() {
    const res = await axios.delete(`${this.placemarkUrl}/api/reviews`);
    return res.data;
  },
};

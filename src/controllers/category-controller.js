import { db } from "../models/db.js";
// Controller for displaying placemarks filtered by category for the logged‑in user
export const categoryController = {
  index: {
    handler: async function (request, h) {
      const category = request.query.category;

      // Use the logged-in user instead of userId from URL
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser) {
        console.log("No logged-in user");
        return h.redirect("/");
      }

      // Convert ObjectId to string
      loggedInUser._id = loggedInUser._id.toString();

      // Load placemarks for this category
      const placemarks =
        await db.placemarkStore.getPlacemarksByUserIdAndCategory(
          loggedInUser._id,
          category,
        );

      // Load all categories for this user
      const allPlacemarks = await db.placemarkStore.getUserPlacemarks(
        loggedInUser._id,
      );
      const categories = [...new Set(allPlacemarks.map((p) => p.category))];

      return h.view("category-view", {
        title: `Category: ${category}`,
        user: loggedInUser,
        category: category,
        placemarks: placemarks,
        categories: categories,
      });
    },
  },
};

import { db } from "../models/db.js";

export const categoryController = {
  index: {
    handler: async function (request, h) {
      const category = request.query.category;
      const userId = request.query.userId;

      // Load the full user
      const user = await db.userStore.getUserById(userId);

      // If user is null, stop the crash
      if (!user) {
        console.log("User not found for ID:", userId);
        return h.redirect("/dashboard");
      }

      // Convert ObjectId to string
      user._id = user._id.toString();

      // Load placemarks for this category
      const placemarks =
        await db.placemarkStore.getPlacemarksByUserIdAndCategory(
          user._id,
          category,
        );

      // Load all categories for this user
      const allPlacemarks = await db.placemarkStore.getUserPlacemarks(user._id);
      const categories = [...new Set(allPlacemarks.map((p) => p.category))];

      return h.view("category-view", {
        title: `Category: ${category}`,
        user: user,
        category: category,
        placemarks: placemarks,
        categories: categories,
      });
    },
  },
};

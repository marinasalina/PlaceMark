import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";
// Controller for the main user dashboard: shows placemarks, categories, and handles CRUD actions
export const dashboardController = {
  // Display the dashboard for the logged‑in user
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      // Redirect if no user is logged in
      if (!loggedInUser) {
        console.log("No logged-in user — redirecting to login");
        return h.redirect("/");
      }
      // convert objectId to string
      loggedInUser._id = loggedInUser._id.toString();
      // Load all placemarks belonging to this user
      const placemarks = await db.placemarkStore.getUserPlacemarks(
        loggedInUser._id,
      );

      // Extract unique categories from the user's placemarks
      const categories = placemarks.map((p) => p.category);
      const uniqueCategories = [...new Set(categories)];

      const viewData = {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        placemarks: placemarks,
        categories: uniqueCategories,
      };
      return h.view("dashboard-view", viewData);
    },
  },
  // Add a new placemark for the logged‑in user
  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },

      // Validation failure: reload dashboard with errors
      failAction: async function (request, h, error) {
        const loggedInUser = request.auth.credentials;

        const placemarks = loggedInUser
          ? await db.placemarkStore.getUserPlacemarks(loggedInUser._id)
          : [];

        return h
          .view("dashboard-view", {
            title: "Add Placemark Error",
            user: loggedInUser,
            placemarks: placemarks,
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },

    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      // Prevent undefined userId
      if (!loggedInUser) {
        console.log("No logged-in user — cannot save placemark");
        return h.redirect("/");
      }
      // Build new placemark object
      const newPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        category: request.payload.category,
        location: request.payload.location,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        isPrivate: request.payload.isPrivate === "on",
        userId: loggedInUser._id,
      };
      // Save placemark to database
      await db.placemarkStore.addPlacemark(loggedInUser._id, newPlacemark);

      return h.redirect("/dashboard");
    },
  },
  // Delete a specific placemark by ID
  deletePlacemark: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      await db.placemarkStore.deletePlacemark(placemarkId);
      return h.redirect("/dashboard");
    },
  },
};

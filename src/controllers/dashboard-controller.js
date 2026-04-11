import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  // Display dashboard for logged‑in user
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser) {
        return h.redirect("/");
      }

      loggedInUser._id = loggedInUser._id.toString();

      // User still sees only their own placemarks
      const placemarks = await db.placemarkStore.getUserPlacemarks(
        loggedInUser._id,
      );

      const categories = [...new Set(placemarks.map((p) => p.category))];

      return h.view("dashboard-view", {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        placemarks,
        categories,
      });
    },
  },

  // Add a new placemark (PUBLIC POI)
  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },

      failAction: async function (request, h, error) {
        const loggedInUser = request.auth.credentials;
        const placemarks = loggedInUser
          ? await db.placemarkStore.getUserPlacemarks(loggedInUser._id)
          : [];

        return h
          .view("dashboard-view", {
            title: "Add Placemark Error",
            user: loggedInUser,
            placemarks,
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },

    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      if (!loggedInUser) {
        return h.redirect("/");
      }

      const { title, description, category, location, latitude, longitude } =
        request.payload;

      // check if placemark already exists
      const existing = await db.placemarkStore.findByNameAndLocation(
        title,
        location,
      );

      if (existing) {
        // Add this POI to the user's dashboard list (optional)
        // Or simply redirect to the existing POI
        return h.redirect(`/placemark/${existing._id}`);
      }

      // Create NEW public placemark
      const newPlacemark = {
        title,
        description,
        category,
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        isPrivate: false,
        userId: loggedInUser._id, // Owner still stored
      };

      const placemark = await db.placemarkStore.addPlacemark(
        loggedInUser._id,
        newPlacemark,
      );

      return h.redirect(`/placemark/${placemark._id}`);
    },
  },

  // Delete a placemark
  deletePlacemark: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      await db.placemarkStore.deletePlacemark(placemarkId);
      return h.redirect("/dashboard");
    },
  },
};

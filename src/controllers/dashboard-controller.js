import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      // Correct store + correct function name
      const placemarks = await db.placemarkStore.getUserPlacemarks(
        loggedInUser._id,
      );

      const viewData = {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        placemarks: placemarks,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h
          .view("dashboard-view", {
            title: "Add PlaceMark Error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },

    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      const newPlacemark = {
        userid: loggedInUser._id,
        name: request.payload.name, // matches schema
        description: request.payload.description,
        category: request.payload.category,
        location: request.payload.location,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
      };

      await db.placemarkStore.addPlacemark(newPlacemark);
      return h.redirect("/dashboard");
    },
  },

  deletePlacemark: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(
        request.params.id,
      );
      await db.placemarkStore.deletePlacemarkById(placemark._id);
      return h.redirect("/dashboard");
    },
  },
};

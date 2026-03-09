import { db } from "../models/db.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);

      if (!placemark) {
        return h.redirect("/dashboard");
      }

      const viewData = {
        title: placemark.title,
        placemark: placemark,
      };

      return h.view("placemark-view", viewData);
    },
  },

  editPlacemark: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;

      const updatedPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        location: request.payload.location,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };

      await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemark);

      return h.redirect(`/placemark/${placemarkId}`);
    },
  },
};

import { db } from "../models/db.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);

      if (!placemark) {
        return h.redirect("/dashboard");
      }

      const loggedInUserId = request.auth.credentials._id.toString();
      const reviews = await db.reviewStore.getReviewsByPlacemarkId(placemarkId);

      // Private POIs only visible to owner
      if (
        placemark.isPrivate &&
        placemark.userId.toString() !== loggedInUserId
      ) {
        return h.redirect("/dashboard");
      }

      return h.view("placemark-view", {
        title: placemark.title,
        placemark: placemark,
        reviews: reviews,
      });
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
        isPrivate: request.payload.isPrivate === "on",
      };

      await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemark);

      return h.redirect(`/placemark/${placemarkId}`);
    },
  },
};

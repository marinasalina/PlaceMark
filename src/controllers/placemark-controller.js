import { db } from "../models/db.js";
// Controller for viewing and editing a single placemark
export const placemarkController = {
  // Display a specific placemark by its ID
  index: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      // Optional userId from query (not required for viewing)
      const userId = request.query.userId;
      // Load the placemark from the database
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      // Redirect if placemark does not exist
      if (!placemark) {
        return h.redirect("/dashboard");
      }
      const loggedInUserId = request.auth.credentials._id.toString();
      const reviews = await db.reviewStore.getReviewsByPlacemarkId(placemarkId);
      // Block access to private placemarks
      if (
        placemark.isPrivate &&
        placemark.userId.toString() !== loggedInUserId
      ) {
        return h.redirect("/dashboard");
      }

      const viewData = {
        title: placemark.title,
        placemark: placemark,
        reviews: reviews,
      };

      return h.view("placemark-view", viewData);
    },
  },
  // Update an existing placemark with new details
  editPlacemark: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      // Build updated placemark object
      const updatedPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        location: request.payload.location,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        isPrivate: request.payload.isPrivate === "on",
      };
      // Save changes to the database
      await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemark);

      return h.redirect(`/placemark/${placemarkId}`);
    },
  },
};

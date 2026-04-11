import { db } from "../models/db.js";

export const reviewController = {
  addReview: {
    handler: async function (request, h) {
      const placemarkId = request.params.id;
      const userId = request.auth.credentials._id;

      const review = {
        placemarkId,
        userId,
        text: request.payload.text,
        rating: Number(request.payload.rating),
      };

      await db.reviewStore.addReview(review);

      return h.redirect(`/placemark/${placemarkId}`);
    },
  },
};

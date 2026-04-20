import { Review } from "../models/mongo/review.js";

export const reviewApi = {
  addReview: {
    auth: false,
    handler: async function (request, h) {
      const review = new Review({
        placemarkId: request.params.id,
        userId: request.payload.userId ?? "anonymous",
        text: request.payload.text,
        rating: request.payload.rating,
      });

      const saved = await review.save();
      return h.response(saved).code(201);
    },
  },

  getReviews: {
    auth: false,
    handler: async function (request, h) {
      return Review.find({ placemarkId: request.params.id });
    },
  },

  deleteAllReviews: {
    auth: false,
    handler: async function (request, h) {
      await Review.deleteMany({});
      return h.response().code(204);
    },
  },
};

import { Review } from "./review.js";

export const reviewMongoStore = {
  async addReview(review) {
    const newReview = new Review(review);
    await newReview.save();
    return newReview;
  },

  async getReviewsByPlacemarkId(placemarkId) {
    return Review.find({ placemarkId }).populate("userId").lean();
  },

  async deleteReviewsByPlacemarkId(placemarkId) {
    await Review.deleteMany({ placemarkId });
  },
};

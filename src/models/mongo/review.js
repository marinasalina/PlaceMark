import Mongoose from "mongoose";

const { Schema } = Mongoose;

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  placemarkId: {
    type: Schema.Types.ObjectId,
    ref: "Placemark",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Review = Mongoose.model("Review", reviewSchema);

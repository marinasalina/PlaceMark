import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  latitude: Number,
  longitude: Number,

  img: {
    type: [String],
    default: [],
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);

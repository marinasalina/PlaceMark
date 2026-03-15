import Mongoose from "mongoose";

const { Schema } = Mongoose;
// Mongoose schema defining the structure of a Placemark document in MongoDB
const placemarkSchema = new Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  latitude: Number,
  longitude: Number,
  // Array of image URLs
  img: {
    type: [String],
    default: [],
  },
  // Reference to the user who created it
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
// Export the Placemark model for use in the Mongo store
export const Placemark = Mongoose.model("Placemark", placemarkSchema);

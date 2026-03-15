import Mongoose from "mongoose";

const { Schema } = Mongoose;
// Mongoose schema defining the structure of a User document in MongoDB
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});
// Export the User model for use in the Mongo store
export const User = Mongoose.model("User", userSchema);

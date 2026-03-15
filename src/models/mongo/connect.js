import * as dotenv from "dotenv";
import Mongoose from "mongoose";
// Connect to MongoDB using connection string from .env file
export function connectMongo() {
  dotenv.config();

  Mongoose.set("strictQuery", true);
  Mongoose.connect(process.env.DB);
  const db = Mongoose.connection;
  // Log connection errors
  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });
  // Log when the database disconnects
  db.on("disconnected", () => {
    console.log("database disconnected");
  });
  // Log successful connection
  db.once("open", function () {
    console.log(`database connected to ${this.name} on ${this.host}`);
  });
}

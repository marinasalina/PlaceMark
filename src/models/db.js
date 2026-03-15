import { userMemStore } from "./mem/user-mem-store.js";
import { placemarkMemStore } from "./mem/placemark-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";

export const db = {
  userStore: null,
  // Initialise the data stores based on the chosen storage type (memory, JSON, or MongoDB)
  placemarkStore: null,

  init(storeType) {
    switch (storeType) {
      case "json":
        // Use JSON file-based storage
        this.userStore = userJsonStore;
        this.placemarkStore = placemarkJsonStore;

        break;
      case "mongo":
        // Use MongoDB storage via Mongoose models
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;

        connectMongo(); // Establish MongoDB connection
        break;

      default: // Fallback to in-memory storage
        this.userStore = userMemStore;
        this.placemarkStore = placemarkMemStore;
    }
  },
};

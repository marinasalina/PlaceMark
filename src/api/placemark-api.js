import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const placemarkApi = {
  find: {
    auth: false,
    handler: async function (request, h) {},
  },

  findOne: {
    auth: false,
    async handler(request) {},
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const placemarklist = request.payload;
        const newPlacemarklist =
          await db.placemarklistStore.addPlacemarklist(placemarklist);
        if (newPlacemarklist) {
          return h.response(newPlacemarklist).code(201);
        }
        return Boom.badImplementation("error creating playlist");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {},
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.playlistStore.deleteAllPlaylists();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};

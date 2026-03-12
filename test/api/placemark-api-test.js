import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import {
  maggie,
  testUsers,
  testPlacemarklist,
  testPlacemarklists,
} from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Placemarklist API tests", () => {
  let user = null;
  setup(async () => {
    await placemarkService.deleteAllPlacemaklists();
    await playtimeService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    placemarklists.userid = user._id;
  });
});

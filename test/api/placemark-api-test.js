import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import {
  maggie,
  testUsers,
  testPlacemark,
  testPlacemarks,
} from "../fixtures.js";
// Increase event listener limit to avoid warnings during tests
EventEmitter.setMaxListeners(25);

suite("Placemark API tests", function () {
  // Allow extra time for database operations (MongoDB Atlas)
  this.timeout(10000);
  let user = null;
  // Reset database and authenticate before each test
  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);

    await placemarkService.authenticate(maggie);

    await placemarkService.deleteAllPlacemarks();

    await placemarkService.deleteAllUsers();
    // Recreate and authenticate test user
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
  });
  // Test creating a single placemark
  test("create placemark", async () => {
    const returnedPlacemark =
      await placemarkService.createPlacemark(testPlacemark);

    assert.isNotNull(returnedPlacemark);
    assertSubset(testPlacemark, returnedPlacemark);
  });
  // Test deleting a placemark
  test("delete a placemark", async () => {
    const placemark = await placemarkService.createPlacemark({
      ...testPlacemark,
      userId: user._id,
    });

    const response = await placemarkService.deletePlacemark(placemark._id);

    assert.equal(response.status, 204);
    // Ensure the placemark no longer exists
    try {
      const returnedPlacemark = await placemarkService.getPlacemark(
        placemark._id,
      );
      assert.fail("Should not return a response");
    } catch (error) {
      assert(
        error.response.data.message === "No Placemark with this id",
        "Incorrect Response Message",
      );
    }
  });
  // Test creating multiple placemarks
  test("create multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      const placemark = {
        ...testPlacemarks[i],
        userId: user._id,
        img: testPlacemarks[i].img,
      };

      await placemarkService.createPlacemark(placemark);
    }

    let returnedLists = await placemarkService.getAllPlacemarks();
    assert.equal(returnedLists.length, testPlacemarks.length);

    await placemarkService.deleteAllPlacemarks();
    returnedLists = await placemarkService.getAllPlacemarks();
    assert.equal(returnedLists.length, 0);
  });
  // Test deleting a placemark that does not exist
  test("remove non-existant placemark", async () => {
    try {
      const response = await placemarkService.deletePlacemark("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(
        error.response.data.message === "No Placemark with this id",
        "Incorrect Response Message",
      );
    }
  });
});

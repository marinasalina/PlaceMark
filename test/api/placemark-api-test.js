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

EventEmitter.setMaxListeners(25);

suite("Placemark API tests", function () {
  // Using a regular function so Mocha can apply this.timeout(), which prevents Atlas delays from causing test timeouts. Using a regular function so Mocha can apply this.timeout(), which prevents Atlas delays from causing test timeouts.
  this.timeout(10000);
  let user = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    placemark.userid = user._id;
  });

  test.only("create placemark", async () => {
    const returnedPlacemark =
      await placemarkService.createPlacemark(testPlacemark);
    assert.isNotNull(returnedPlacemark);
    assertSubset(testPlacemark, returnedPlacemark);
  });

  test("delete a placemark", async () => {
    const placemark = await placemarkService.createPlacemark({
      ...testPlacemark,
      userId: user._id,
    });
    const response = await placemarkService.deletePlacemark(placemark._id);
    assert.equal(response.status, 204);
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

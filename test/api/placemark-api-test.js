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
import { testReview, testReview2 } from "../fixtures.js";

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
  test("public POI: should reuse existing placemark instead of creating duplicate", async () => {
    // Create first POI
    const poi1 = await placemarkService.createPlacemark(testPlacemark);

    // Try to create the same POI again
    const poi2 = await placemarkService.createPlacemark(testPlacemark);

    // They MUST have the same ID
    assert.equal(
      poi1._id,
      poi2._id,
      "Duplicate POI was created instead of reusing existing one",
    );
  });

  test("shared reviews: all users should see all reviews for the same public POI", async () => {
    // Create public POI
    const poi = await placemarkService.createPlacemark(testPlacemark);

    // Add review from user1
    await placemarkService.addReview(poi._id, {
      text: "Nice place",
      rating: 5,
      userId: user._id,
    });

    // Create second user
    const user2 = await placemarkService.createUser(testUsers[1]);
    await placemarkService.authenticate(testUsers[1]);

    // Add review from user2
    await placemarkService.addReview(poi._id, {
      text: "Great!",
      rating: 4,
      userId: user2._id,
    });

    // Fetch all reviews
    const reviews = await placemarkService.getReviews(poi._id);

    assert.equal(reviews.length, 2, "Reviews are not shared between users");
    assert.equal(
      reviews[0].placemarkId,
      reviews[1].placemarkId,
      "Reviews belong to different POIs",
    );
  });
  test("placemark view should return POI with all shared reviews", async () => {
    const poi = await placemarkService.createPlacemark(testPlacemark);

    await placemarkService.addReview(poi._id, testReview);
    await placemarkService.addReview(poi._id, testReview2);

    const reviews = await placemarkService.getReviews(poi._id);

    assert.equal(
      reviews.length,
      2,
      "Placemark view did not return all reviews",
    );
  });
});

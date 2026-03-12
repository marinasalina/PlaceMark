import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, testPlacemark, maggie } from "../fixtures.js";

// setup
suite("Placemark Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    await db.userStore.deleteAll();
  });

  // test to create a single placemark
  test("create single placemark", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(
      user._id,
      testPlacemark,
    );
    assert.isNotNull(placemark._id);
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, 1);
  });

  // test to create multiple placemarks
  test("create multiple placemarks", async () => {
    const user = await db.userStore.addUser(maggie);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      await db.placemarkStore.addPlacemark(user._id, testPlacemarks[i]);
    }
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, testPlacemarks.length);
  });

  // test to successfully get a placemark
  test("get a placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const addedPlacemark = await db.placemarkStore.addPlacemark(
      user._id,
      testPlacemark,
    );
    const retrievedPlacemark = await db.placemarkStore.getPlacemarkById(
      addedPlacemark._id,
    );
    assert.equal(retrievedPlacemark.title, testPlacemark.title);
  });

  // test to get all placemarks based on a users id
  test("get placemarks by user id", async () => {
    const user = await db.userStore.addUser(maggie);
    await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    const placemarks = await db.placemarkStore.getPlacemarksByUserId(user._id);
    assert.equal(1, placemarks.length);
  });

  // test to successfully delete a single placemark
  test("delete One Placemark - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const placemark = await db.placemarkStore.addPlacemark(
      user._id,
      testPlacemark,
    );
    await db.placemarkStore.deletePlacemark(placemark._id);
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, placemarks.length);
  });

  // test to delete all placemarks
  test("delete all placemarks", async () => {
    const user = await db.userStore.addUser(maggie);
    await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    await db.placemarkStore.deleteAllPlacemarks();
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, placemarks.length);
  });

  // test to unsuccessfully get a placemark
  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  // test to unsuccessfully delete a placemark by passing in a bad id
  test("delete one placemark - fail", async () => {
    const user = await db.userStore.addUser(maggie);
    await db.placemarkStore.addPlacemark(user._id, testPlacemark);
    await db.placemarkStore.deletePlacemark("1551");
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(1, placemarks.length);
  });
});

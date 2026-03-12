import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { maggie, testUsers } from "../fixtures.js";

suite("User tests", () => {
  setup(async () => {
    db.init();
    await db.userStore.deleteAll();
  });
  // Checks that adding a user returns the same user data was provided
  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assert.deepEqual(maggie, newUser);
  });

  test("delete all users", async () => {
    // Add all users to the db
    for (let i = 0; i < testUsers.length; i += 1) {
      // Await inside the loop ensures each user is stored before moving the next
      await db.userStore.addUser(testUsers[i]);
    }
    // Verify that the users were added
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    // Delete all users
    await db.userStore.deleteAll();
    // Confirm the database is now empty
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });

  // Checking that we can retrieve a user by ID and by email.
  test("get a user - success", async () => {
    //Add user Maggie
    const user = await db.userStore.addUser(maggie);
    // Get the user back from the database using their unique ID
    const returnedUser1 = await db.userStore.getUserById(user._id);
    //Check that the user got back by ID is exactly the same as was added
    assert.deepEqual(user, returnedUser1);
    //Get the same user by email
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    // Check that the same user returned by email
    assert.deepEqual(user, returnedUser2);
  });
  // Delete one user
  test("delete One User - success", async () => {
    // Add all test users first
    for (const user of testUsers) {
      await db.userStore.addUser(user);
    }
    // Delete the first user
    await db.userStore.deleteUserById(testUsers[0]._id);
    // Check that one user was removed
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    // Confirm the deleted user is gone
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });

  //Making sure invalid IDs or emails return null instead of crashing.
  test("get a user - bad params", async () => {
    // Returns null when the email string is empty
    assert.isNull(await db.userStore.getUserByEmail(""));
    // Returns null when the ID string is empty
    assert.isNull(await db.userStore.getUserById(""));
    // Returns null when no ID
    assert.isNull(await db.userStore.getUserById());
  });
  // Confirming that the database stays unchanged when the ID is invalid.
  test("delete One User - fail", async () => {
    // Add all test users first
    for (const user of testUsers) {
      await db.userStore.addUser(user);
    }

    // Try deleting a user that does not exist
    await db.userStore.deleteUserById("bad-id");

    // Database should remain unchanged
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(allUsers.length, testUsers.length);
  });
});

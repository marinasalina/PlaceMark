import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie } from "../fixtures.js";
// Test suite for authentication-related API functions
suite("Authentication API tests", function () {
     // Runs before each test
  setup(async () => {
    this.timeout(10000);
    placemarkService.clearAuth(); // Remove any stored auth token
    await placemarkService.createUser(maggie);// Create test user

    await placemarkService.authenticate(maggie);// Log in test user

    await placemarkService.deleteAllUsers();// Clean database

    process.env.JWT_SECRET = "secret";// Set JWT secret for decoding
  });
 // Test user authentication returns a token
  test("authenticate", async () => {
    await placemarkService.createUser(maggie);
    const response = await placemarkService.authenticate(maggie);
    assert(response.success);
    assert.isDefined(response.token);
  });
  // Test that the returned JWT contains correct user info
  test("verify Token", async () => {
    const returnedUser = await placemarkService.createUser(maggie);

    const response = await placemarkService.authenticate(maggie);

    const userInfo = decodeToken(response.token);

    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.id, returnedUser._id);
  });
});

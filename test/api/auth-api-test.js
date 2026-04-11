import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie } from "../fixtures.js";

suite("Authentication API tests", function () {
  this.timeout(10000);

  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggie);
    process.env.JWT_SECRET = "secret";
  });

  test("authenticate", async () => {
    await placemarkService.deleteAllUsers();
    await placemarkService.createUser(maggie);

    const response = await placemarkService.authenticate(maggie);

    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    await placemarkService.deleteAllUsers();
    const returnedUser = await placemarkService.createUser(maggie);

    const response = await placemarkService.authenticate(maggie);
    const userInfo = decodeToken(response.token);

    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.id, returnedUser._id);
  });
});

const mongoose = require("mongoose");
const User = require("../models/User");

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/testdb")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Model Validation", () => {
  
  test("Should create a valid user", async () => {
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      birthday: "1995-05-10",
      timezone: "America/New_York",
    });

    await expect(user.validate()).resolves.toBeUndefined();
  });

});

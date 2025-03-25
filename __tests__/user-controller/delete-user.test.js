const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const connectDB = require("../../config/db");
const User = require("../../models/User");

describe("Delete user API test", () => {
    let user;

    beforeAll(async () => {
        await connectDB();
        await User.deleteMany({});

        user = new User({
            name: "Success User",
            email: "success@mail.com",
            birthday: "2010-10-10",
            timezone: "Asia/Jakarta"
        });
        await user.save();
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });


    it("should return 200 status code when successfully delete user by ID", async () => {
        const response = await request(app)
            .delete(`/api/users/${user._id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User deleted successfully");
    });

    it("should return 400 status code when user ID is invalid", async () => {
        const response = await request(app)
            .delete(`/api/users/abc123`)
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid ID format.");
    });

    it("should return 404 status code when user is not found", async () => {
        const response = await request(app)
            .delete(`/api/users/000000000000000000000000`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found");
    });

})
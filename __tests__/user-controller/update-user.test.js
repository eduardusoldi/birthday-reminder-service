const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const connectDB = require("../../config/db");
const User = require("../../models/User");

describe("Update user API test", () => {
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


    it("should return 200 status code when successfully update user by ID", async () => {
        let userRequestBody = {
            name: "Updated User",
            email: "updated@mail.com",
        };
        const response = await request(app)
            .put(`/api/users/${user._id}`)
            .send(userRequestBody);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "User updated successfully");
        expect(response.body.data).toHaveProperty("name", userRequestBody.name);
        expect(response.body.data).toHaveProperty("email", userRequestBody.email);
        expect(response.body.data).toHaveProperty("timezone", user.timezone);
        expect(response.body.data).toHaveProperty("birthday", new Date(user.birthday).toISOString());
    });

    it("should return 400 status code when the request body is empty", async () => {
        let userRequestBody = {};

        const response = await request(app)
            .put(`/api/users/${user._id}`)
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please fill minimum one field.")
    });

    it("should return 400 status code when user ID is invalid", async () => {
        let userRequestBody = {
            name: "Updated User",
            email: "updated@mail.com",
        };
        const response = await request(app)
            .put(`/api/users/abc123`)
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid ID format.");
    });

    it("should return a 400 status code when the invalid fields is given", async () => {
        let userRequestBody = {
            name: "Updated User",
            email: "updated@mail.com",
            invalidFields1: "invalid fields1",
            invalidFields2: "invalid fields2",
        };

        const response = await request(app)
            .put(`/api/users/${user._id}`)
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Invalid fields: invalidFields1, invalidFields2")
    });

    it("should return 404 status code when user is not found", async () => {
        let userRequestBody = {
            name: "Updated User",
            email: "updated@mail.com",
        };
        const response = await request(app)
            .put(`/api/users/000000000000000000000000`)
            .send(userRequestBody);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found");
    });
})
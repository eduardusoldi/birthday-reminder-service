const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/User");
const connectDB = require('../../config/db')

describe("Create user API test", () => {
    beforeAll(async () => {
        await connectDB();
        await User.deleteMany({})

        let user = new User({
            name: "Email Taken",
            email: "taken@email.com",
            birthday: "2010-10-10",
            timezone: "Asia/Jakarta"
        });
        await user.save();
    });


    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.connection.close();
    });

    it("should return 201 status code when success creating user", async () => {
        let userRequestBody = {
            name: "Success User",
            email: "success@mail.com",
            birthday: "2010-10-10",
            timezone: "Asia/Jakarta"
        };

        const response = await request(app)
            .post("/api/users")
            .send(userRequestBody);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "User created successfully");
        expect(response.body.data).toHaveProperty("name", userRequestBody.name);
        expect(response.body.data).toHaveProperty("email", userRequestBody.email);
        expect(response.body.data).toHaveProperty("timezone", userRequestBody.timezone);
        expect(response.body.data).toHaveProperty("birthday", new Date(userRequestBody.birthday).toISOString());
    });

    it("should return 400 status code when the request body is empty", async () => {
        let userRequestBody = {};

        const response = await request(app)
            .post("/api/users")
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Please fill the fields.")
    });

    it("should return a 400 status code when an invalid email is provided", async () => {
        let userRequestBody = {
            name: "Success User",
            email: "successmail.com",
            birthday: "2010-10-10",
            timezone: "Asia/Jakarta"
        };

        const response = await request(app)
            .post("/api/users")
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "The email format is invalid")
    });

    it("should return a 400 status code when an invalid birthday is provided", async () => {
        let userRequestBody = {
            name: "Success User",
            email: "success@mail.com",
            birthday: "2010-10-1000",
            timezone: "Asia/Jakarta"
        };

        const response = await request(app)
            .post("/api/users")
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "The birthday format is invalid")
    });

    it("should return a 400 status code when an invalid timezone is provided", async () => {
        let userRequestBody = {
            name: "Success User",
            email: "success@mail.com",
            birthday: "2010-10-10",
            timezone: "Asia/J"
        };

        const response = await request(app)
            .post("/api/users")
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "The timezone must be a valid IANA timezone")
    });

    it("should return a 400 status code when the provided email is already taken", async () => {
        let userRequestBody = {
            name: "Email Taken",
            email: "taken@email.com",
            birthday: "2010-10-10",
            timezone: "Asia/Jakarta"
        };

        const response = await request(app)
            .post("/api/users")
            .send(userRequestBody);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", `The email ${userRequestBody.email} is already taken. Please choose a different email.`)
    });


});

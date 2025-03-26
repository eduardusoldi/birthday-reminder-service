const mongoose = require("mongoose");
const User = require("../models/User");
const moment = require("moment-timezone");
const { sendBirthdayMessages } = require("../workers/birthdayWorker");
const cron = require("node-cron");

jest.mock("../models/User");

afterAll(async () => {
  mongoose.connection.close();
  cron.getTasks().forEach((task) => task.stop()); // Stop cron jobs
});

describe("Birthday Worker Tests", () => {
  beforeAll(() => {
    jest.useFakeTimers();

    // Mock current time to March 26, 2025, 09:00 AM in Jakarta (UTC+7)
    const mockCurrentTime = new Date(Date.UTC(2025, 2, 26, 2, 0, 0)); // 02:00 UTC == 09:00 Jakarta
    jest.setSystemTime(mockCurrentTime);

    // ✅ Correctly mock moment.tz() to use the system time mock
    jest.spyOn(moment, "tz").mockImplementation((date, timezone) => {
      return moment.utc(date).tz(timezone); // Convert to correct timezone
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should console.log users with birthdays in range and timezone", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const mockUsers = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Alice",
        email: "alice@example.com",
        birthday: new Date("1990-03-26T09:00:00.000Z"),
        timezone: "Asia/Jakarta",
      },
    ];

    User.find.mockResolvedValue(mockUsers);

    await sendBirthdayMessages();

    const logs = consoleSpy.mock.calls.flat().join("\n");

    expect(logs).toContain("🎉 Happy Birthday, Alice!");
    expect(logs).toContain("📩 Sending birthday email to: alice@example.com");
  });

  it("should log that it's not 9 AM yet and skip sending email", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const mockUsers = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Paul",
        email: "paul@example.com",
        birthday: new Date("1990-03-26T00:00:00.000Z"),
        timezone: "Europe/Rome",
      },
    ];

    User.find.mockResolvedValue(mockUsers);

    await sendBirthdayMessages();

    const logs = consoleSpy.mock.calls.flat().join("\n");

    // Assert "Not 9 AM yet" log appears
    expect(logs).toContain("⏳ Not 9 AM yet in Europe/Rome, skipping Paul");

    // Ensure no email is sent
    expect(logs).not.toContain("📩 Sending birthday email to: paul@example.com");

    consoleSpy.mockRestore();
  });
});

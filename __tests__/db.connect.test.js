const mongoose = require("mongoose");
const connectDB = require("../config/db");

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("MongoDB Connection", () => {
  let consoleErrorSpy, processExitSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    processExitSpy = jest.spyOn(process, "exit").mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to the correct database in test environment", async () => {
    const mockUriTest = "mongodb://mongodb:27017/mydatabase_test";
    const mockDbNameTest = "mydatabase_test";
    mongoose.connect.mockResolvedValue();

    const isTestEnv = true;

    await connectDB(isTestEnv);

    expect(mongoose.connect).toHaveBeenCalledWith(mockUriTest, {
      dbName: mockDbNameTest,
    });
  })

  it("should log an error and exit process when connection fails", async () => {
    mongoose.connect.mockRejectedValue(new Error("Database connection failed"));

    await connectDB();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "MongoDB connection error:",
      expect.any(Error)
    );

    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});

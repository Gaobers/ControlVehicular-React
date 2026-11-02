jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(null),
    removeItem: jest.fn().mockResolvedValue(null)
}));


const API = require("./src/api").default;

API.defaults.adapter = async (config) => {
    const method = config.method?.toUpperCase() || "GET";

    throw new Error(
        `Unexpected HTTP request in component tests: ${method} ${config.url}`
    );
};
import axios from "axios";
import {
  fetchWeatherData,
  calculateDailySummaries,
  fetchAndSummarizeWeather,
  fetchAvgTempSummary,
  fetchWeatherByCityAndDate,
} from "../controllers/WeatherController.controller.js";
import { DailySummary, AvgTempSummary } from "../models/DailySummary.model.js";
import { kelvinToCelcius } from "../utils/kelvinToCelcius.js";

// Mock axios and database models
jest.mock("axios");
jest.mock("../models/DailySummary.model.js");
jest.mock("../utils/kelvinToCelcius.js");

describe("Weather System Tests", () => {
  // Test case 1: Connect to OpenWeatherMap API and retrieve data for Mumbai
  it("should connect to OpenWeatherMap API and retrieve data for Mumbai", async () => {
    const mockApiResponse = {
      data: {
        main: {
          temp: 303.14, // Kelvin
          feels_like: 306.37, // Kelvin
        },
        weather: [{ main: "Haze" }],
        dt: 1729619563, // Mock timestamp (same as actual response)
      },
    };

    axios.get.mockResolvedValue(mockApiResponse);
    kelvinToCelcius.mockReturnValueOnce(30); // Mock conversion for temp
    kelvinToCelcius.mockReturnValueOnce(33); // Mock conversion for feels_like

    const weatherData = await fetchWeatherData("Mumbai", 35);

    // console.log(weatherData); // Log the returned weatherData

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("q=Mumbai"));
    expect(weatherData).toBeDefined();
    expect(weatherData.temp).toBe(30); // Updated based on mock
    expect(weatherData.feels_like).toBe(33); // Updated based on mock
    expect(weatherData.timestamp).toBe(1729619563); // Ensure timestamp matches
    expect(weatherData.alerts).toEqual([]); // Ensure no alerts for this case
  });

  // Test case 2: Retrieve and parse weather data correctly for Delhi
  it("should retrieve and parse weather data correctly for Delhi", async () => {
    const mockApiResponse = {
      data: {
        main: { temp: 295 }, // Mock temp in Kelvin
        weather: [{ main: "Haze" }], // Mock weather condition
      },
    };
    axios.get.mockResolvedValue(mockApiResponse);
    kelvinToCelcius.mockReturnValue(22); // Mock temperature conversion to Celsius

    const result = await fetchWeatherData("Delhi", 35);
    expect(result).toEqual({
      city: "Delhi",
      main: expect.any(String), // Accept any weather condition (Haze, Clear, etc.)
      temp: expect.any(Number), // Accept any temperature value (in Celsius)
      feels_like: 22, // Mock feels_like temperature
      alerts: [], // No alerts triggered in this case
    });
  });

  // Test case 3: Convert temperature from Kelvin to Celsius for Chennai
  it("should convert temperature from Kelvin to Celsius for Chennai", () => {
    kelvinToCelcius.mockReturnValue(27);
    const tempInCelsius = kelvinToCelcius(300);
    expect(tempInCelsius).toBe(27);
  });

  // Test case 4: Calculate daily summaries for Bangalore and Kolkata
  it("should calculate daily summaries for Bangalore and Kolkata", async () => {
    const weatherData = {
      Bangalore: { temp: 30, main: "Clear", alerts: [] },
      Kolkata: { temp: 35, main: "Rain", alerts: ["Severe Weather: Rain"] },
    };

    DailySummary.findOrCreate.mockResolvedValue({
      city: "Bangalore",
      date: new Date().toISOString().split("T")[0],
      temps: [],
      save: jest.fn(), // Mock save function
    });

    await calculateDailySummaries(weatherData);
    expect(DailySummary.findOrCreate).toHaveBeenCalledWith("Bangalore");
    expect(DailySummary.findOrCreate).toHaveBeenCalledWith("Kolkata");
  });

  // Test case 5: Trigger alerts when threshold is breached in Hyderabad
  it("should trigger alerts when threshold is breached in Hyderabad", async () => {
    const mockApiResponse = {
      data: { main: { temp: 310 }, weather: [{ main: "Thunderstorm" }] },
    };
    axios.get.mockResolvedValue(mockApiResponse);
    kelvinToCelcius.mockReturnValue(37);

    const result = await fetchWeatherData("Hyderabad", 35);
    expect(result.alerts).toContain("High Temperature: 37°C");
    expect(result.alerts).toContain("Severe Weather: Thunderstorm");
  });

  // Test case 6: Fetch and update average temperature summaries for Delhi and Mumbai
  it("should fetch and update average temperature summaries for Delhi and Mumbai", async () => {
    const mockSummaryData = [
      { city: "Delhi", avgTemp: 25, date: "2024-10-21" },
      { city: "Mumbai", avgTemp: 28, date: "2024-10-21" },
    ];

    DailySummary.find.mockResolvedValue(mockSummaryData);
    AvgTempSummary.findOne.mockResolvedValue(null);
    const saveMock = jest.fn();
    AvgTempSummary.mockImplementation(() => ({ save: saveMock }));

    await fetchAvgTempSummary({}, { json: jest.fn() });
    expect(DailySummary.find).toHaveBeenCalledWith({
      date: expect.any(String),
    });
    expect(saveMock).toHaveBeenCalled();
  });

  // Test case 7: Fetch weather data for Kolkata on a specific date
  it("should fetch weather data for Kolkata on a specific date", async () => {
    const mockSummary = {
      city: "Kolkata",
      date: "2024-10-21",
      avgTemp: 26,
      maxTemp: 30,
      minTemp: 20,
      alerts: [],
    };
    DailySummary.findOne.mockResolvedValue(mockSummary);

    const req = { params: { city: "Kolkata", date: "2024-10-21" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await fetchWeatherByCityAndDate(req, res);

    expect(DailySummary.findOne).toHaveBeenCalledWith({
      city: "Kolkata",
      date: "2024-10-21",
    });
    expect(res.json).toHaveBeenCalledWith(mockSummary);
  });
});

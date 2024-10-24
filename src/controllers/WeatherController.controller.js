import axios from "axios";
import { DailySummary, AvgTempSummary } from "../models/DailySummary.model.js";
import { kelvinToCelcius } from "../utils/kelvinToCelcius.js";
import { cities } from "../utils/cities.js";

const ALERT_THRESHOLDS = {
  highTemp: 35,
  lowTemp: 0,
  severeWeather: ["Thunderstorm", "Rain", "Snow"],
};

const sendAlert = (city, condition, message) => {
  console.log(`ALERT for ${city}: ${condition} - ${message}`);
};

export const fetchWeatherData = async (city, threshold) => {
  const API_KEY = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  const th = threshold || 25;

  try {
    const response = await axios.get(url);
    const data = response.data;

    // console.log("API Response:", data); // Log the entire response

    const alerts = [];
    const temp = kelvinToCelcius(data.main.temp);
    const feelsLike = kelvinToCelcius(data.main.feels_like);

    // High temperature alert
    if (temp > th) {
      alerts.push(`High Temperature: ${temp}°C`);
      sendAlert(
        city,
        "High Temperature",
        `The temperature is above ${th}°C!`
      );
    }

    // Severe weather alert
    if (ALERT_THRESHOLDS.severeWeather.includes(data.weather[0].main)) {
      alerts.push(`Severe Weather: ${data.weather[0].main}`);
    }

    return {
      city,
      main: data.weather[0].main,
      temp,
      feels_like: feelsLike,
      timestamp: data.dt, // Ensure this field is assigned
      alerts,
    };
  } catch (error) {
    console.error(`Error fetching data for ${city}:`, error.message);
    return null;
  }
};

export const calculateDailySummaries = async (weatherData) => {
  for (let city of Object.keys(weatherData)) {
    const data = weatherData[city];
    if (!data) continue;

    const summary = await DailySummary.findOrCreate(city);

    // Clear previous alerts when updating the daily summary for a city
    summary.alerts = []; // Clear existing alerts

    // Update the temperature data
    summary.maxTemp = Math.max(summary.maxTemp, data.temp);
    summary.minTemp = Math.min(summary.minTemp, data.temp);
    summary.temps.push(data.temp);
    summary.avgTemp = (
      summary.temps.reduce((acc, t) => acc + t, 0) / summary.temps.length
    ).toFixed(2);

    // Update dominant weather and new alerts
    summary.dominantWeather = data.main;
    summary.alerts = summary.alerts.concat(data.alerts); // Add only new alerts

    // Save the updated summary to the database
    await summary.save();
  }
};

export const fetchAndSummarizeWeather = async (req, res) => {
  const { threshold } = req.body;

  const promises = cities.map((city) => fetchWeatherData(city, threshold));
  const results = await Promise.all(promises);

  const weatherData = {};
  results.forEach((result) => {
    if (result) weatherData[result.city] = result;
  });

  // Calculate and update daily summaries
  await calculateDailySummaries(weatherData);

  // Fetch the updated summaries from the database
  const summaries = await DailySummary.find().sort({ date: -1 }).limit(6);

  res.json({
    message: "Weather data updated and summaries calculated",
    summaries,
  });
};

export const fetchAvgTempSummary = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];

    const summaries = await DailySummary.find({ date: currentDate });

    for (let summary of summaries) {
      const avgTemp = summary.avgTemp;
      const date = summary.date;

      let avgTempSummary = await AvgTempSummary.findOne({
        city: summary.city,
      });

      if (!avgTempSummary) {
        avgTempSummary = new AvgTempSummary({
          city: summary.city,
          dates: [date],
          avgTemps: [avgTemp],
        });
      } else {
        const todayIndex = avgTempSummary.dates.indexOf(date);

        if (todayIndex === -1) {
          avgTempSummary.dates.push(date);
          avgTempSummary.avgTemps.push(avgTemp);
        } else {
          avgTempSummary.avgTemps[todayIndex] = avgTemp;
        }
      }

      await avgTempSummary.save();
    }

    const updatedAvgTempSummaries = await AvgTempSummary.find();
    res.json({
      message:
        "Average temperature summary updated for today and historical data",
      updatedAvgTempSummaries,
    });
  } catch (error) {
    console.error("Error fetching and storing avgTempSummary:", error);
    res.status(500).json({
      message: "Failed to update average temperature summary",
    });
  }
};

export const fetchWeatherByCityAndDate = async (req, res) => {
  const { city, date } = req.params; // Get city name and date from the URL

  try {
    const weatherSummary = await DailySummary.findOne({ city, date });

    if (!weatherSummary) {
      return res
        .status(404)
        .json({ message: `Weather data for ${city} on ${date} not found` });
    }

    res.json(weatherSummary);
  } catch (error) {
    console.error(`Error fetching weather data for ${city} on ${date}:`, error);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
};

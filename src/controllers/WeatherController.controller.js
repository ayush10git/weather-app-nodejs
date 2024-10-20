import axios from "axios";
import { DailySummary } from "../models/DailySummary.model.js";
import { kelvinToCelcius } from "../utils/kelvinToCelcius.js";
import { cities } from "../utils/cities.js";

export const fetchWeatherData = async (city) => {
  const API_KEY = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    return {
      city,
      main: data.weather[0].main,
      temp: kelvinToCelcius(data.main.temp),
      feels_like: kelvinToCelcius(data.main.feels_like),
      timestamp: data.dt,
    };
  } catch (error) {
    console.error(`Error fetching data for ${city}:`, error.message);
    return null;
  }
};

const ALERT_THRESHOLDS = {
  highTemp: 31, 
  lowTemp: 0, 
  severeWeather: ["Thunderstorm", "Rain", "Snow"], 
};

const sendAlert = (city, condition, message) => {
  console.log(`ALERT for ${city}: ${condition} - ${message}`);
};

export const calculateDailySummaries = async (weatherData) => {
  for (let city of Object.keys(weatherData)) {
    const data = weatherData[city];
    if (!data) continue;

    const summary = await DailySummary.findOrCreate(city);

    summary.maxTemp = Math.max(summary.maxTemp, data.temp);
    summary.minTemp = Math.min(summary.minTemp, data.temp);
    summary.temps.push(data.temp);
    summary.avgTemp = (
      summary.temps.reduce((acc, t) => acc + t, 0) / summary.temps.length
    ).toFixed(2);

    summary.dominantWeather = data.main;

    if (data.temp > ALERT_THRESHOLDS.highTemp) {
      sendAlert(
        city,
        "High Temperature",
        `The temperature is above ${ALERT_THRESHOLDS.highTemp}°C!`
      );
    }
    if (data.temp < ALERT_THRESHOLDS.lowTemp) {
      sendAlert(
        city,
        "Low Temperature",
        `The temperature is below ${ALERT_THRESHOLDS.lowTemp}°C!`
      );
    }
    if (ALERT_THRESHOLDS.severeWeather.includes(data.main)) {
      sendAlert(
        city,
        "Severe Weather",
        `Severe weather condition detected: ${data.main}.`
      );
    }

    await summary.save(); 
  }
};

export const fetchAndSummarizeWeather = async (req, res) => {
  const promises = cities.map((city) => fetchWeatherData(city));
  const results = await Promise.all(promises);

  const weatherData = {};
  results.forEach((result) => {
    if (result) weatherData[result.city] = result;
  });

  await calculateDailySummaries(weatherData);
  res.json({ message: "Weather data updated and summaries calculated" });
};

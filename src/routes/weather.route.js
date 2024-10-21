import express from "express";
import { fetchAndSummarizeWeather, fetchAvgTempSummary, fetchWeatherByCityAndDate } from "../controllers/WeatherController.controller.js";

const router = express.Router();

router.get("/update", fetchAndSummarizeWeather);
router.get("/avg", fetchAvgTempSummary);
router.get("/:city/:date", fetchWeatherByCityAndDate);

export default router;

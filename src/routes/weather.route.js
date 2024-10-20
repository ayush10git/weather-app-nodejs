import express from "express";
import { fetchAndSummarizeWeather } from "../controllers/WeatherController.controller.js";

const router = express.Router();

router.get("/update", fetchAndSummarizeWeather);

export default router;

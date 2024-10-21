import cron from "node-cron";
import {
  fetchAndSummarizeWeather,
  fetchAvgTempSummary,
} from "../controllers/WeatherController.controller.js";

export const scheduleWeatherUpdates = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Fetching weather updates...");
    await fetchAndSummarizeWeather();
    await fetchAvgTempSummary();
  });

  cron.schedule("0 0 * * *", async () => {
    console.log(
      "Midnight reset: Finalizing avgTemp for the day and starting new day updates..."
    );
    await fetchAvgTempSummary();
  });
};

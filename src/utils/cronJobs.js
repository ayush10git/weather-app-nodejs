import cron from 'node-cron';
import { fetchAndSummarizeWeather } from '../controllers/WeatherController.controller.js';

export const scheduleWeatherUpdates = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('Fetching weather updates...');
    await fetchAndSummarizeWeather();
  });
};

import express from "express";
import cors from "cors"
import { scheduleWeatherUpdates } from "./utils/cronJobs.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

scheduleWeatherUpdates();

import weatherRouter from "./routes/weather.route.js"

app.use("/api/weather", weatherRouter);

export { app }
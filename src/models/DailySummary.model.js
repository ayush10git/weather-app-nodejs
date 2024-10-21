import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: String, required: true },
  maxTemp: { type: Number, default: -Infinity },
  minTemp: { type: Number, default: Infinity },
  avgTemp: { type: Number },
  dominantWeather: { type: String },
  temps: { type: [Number], default: [] },
  alerts: {
    type: [String], // Array to store alerts related to the city's weather
    default: [],}
});

dailySummarySchema.statics.findOrCreate = async function (city) {
  const date = new Date().toISOString().split("T")[0];
  let summary = await this.findOne({ city, date });
  if (!summary) {
    summary = new this({ city, date, temps: [] });
  }
  return summary;
};

const dailyAvgTempSchema = new mongoose.Schema({
  city: { type: String, required: true },
  dates: { type: [String], default: [] }, // Array of dates
  avgTemps: { type: [Number], default: [] }, // Array of corresponding average temperatures
});

export const DailySummary = mongoose.model("DailySummary", dailySummarySchema);
export const AvgTempSummary = mongoose.model("AvgTempSummary", dailyAvgTempSchema);
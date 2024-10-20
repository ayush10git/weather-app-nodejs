import mongoose from "mongoose";

const dailySummarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: String, required: true },
  maxTemp: { type: Number, default: -Infinity },
  minTemp: { type: Number, default: Infinity },
  avgTemp: { type: Number },
  dominantWeather: { type: String },
  temps: { type: [Number], default: [] },
});

dailySummarySchema.statics.findOrCreate = async function (city) {
  const date = new Date().toISOString().split("T")[0];
  let summary = await this.findOne({ city, date });
  if (!summary) {
    summary = new this({ city, date, temps: [] });
  }
  return summary;
};

export const DailySummary = mongoose.model("DailySummary", dailySummarySchema);

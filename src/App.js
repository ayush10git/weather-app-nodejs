import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LineChart from "./components/LineChart";
import WeatherData from "./components/WeatherData";

function App() {
  const [summaries, setSummaries] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [threshold, setThreshold] = useState("");

  const date = new Date().getDate();
  console.log(date);

  // Function to update weather
  const updateWeather = async (tempThreshold) => {
    const defaultThreshold = tempThreshold || 35;
    try {
      await axios.post("http://localhost:4000/api/weather/update", {
        threshold: defaultThreshold,
      });
      toast.success("Weather data updated!");
    } catch (error) {
      console.error("Error updating weather:", error);
      toast.error("Failed to update weather data.");
    }
  };

  useEffect(() => {
    updateWeather();
  }, []);

  useEffect(() => {
    const fetchAvgTemperature = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/weather/avg"
        );
        const avgTempSummaries = response.data.updatedAvgTempSummaries;

        if (avgTempSummaries && Array.isArray(avgTempSummaries)) {
          setSummaries(avgTempSummaries);
          setSelectedCity(avgTempSummaries[0]?.city);
        }
      } catch (error) {
        console.error("Error fetching average temperature data:", error);
        toast.error("Error fetching average temperature data.");
      }
    };
    fetchAvgTemperature();
  }, [date]);

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      if (!selectedCity) return;

      try {
        const response = await axios.get(
          `http://localhost:4000/api/weather/${selectedCity}/${
            new Date().toISOString().split("T")[0]
          }`
        );
        setCurrentWeather(response.data);
      } catch (error) {
        console.error("Error fetching current weather data:", error);
        toast.error("Error fetching current weather data.");
      }
    };

    fetchCurrentWeather();
  }, [selectedCity, date]);

  const handleThresholdChange = (e) => {
    setThreshold(e.target.value);
  };

  const submitThreshold = () => {
    if (!threshold || isNaN(parseFloat(threshold))) {
      toast.error("Please enter a valid temperature threshold.");
      return;
    }
    toast.success("Threshold has been updated");
    updateWeather(parseFloat(threshold));
  };

  return (
    <div className="main">
      <h1>Weather Dashboard</h1>

      <div className="tabs">
        {summaries.map((summary) => (
          <button
            className="tab-btn"
            key={summary.city}
            onClick={() => setSelectedCity(summary.city)}
            style={{
              borderBottom:
                selectedCity === summary.city ? "1px solid #007bff" : "#f0f0f0",
              color: selectedCity === summary.city ? "#007bff" : "#000",
            }}
          >
            {summary.city}
          </button>
        ))}
      </div>

      {selectedCity && (
        <div className="container">
          <div className="line-chart">
            <LineChart
              summary={summaries.find(
                (summary) => summary.city === selectedCity
              )}
            />
          </div>
          <div className="weather">
            <WeatherData cityData={currentWeather} />
            <div className="threshold-container">
              <input
                type="number"
                placeholder="Enter temp in C"
                value={threshold}
                onChange={handleThresholdChange}
              />
              <button onClick={submitThreshold}>Set threshold</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
}

export default App;

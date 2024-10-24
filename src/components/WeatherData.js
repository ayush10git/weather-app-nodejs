import React, { useState, useEffect } from "react";

const WeatherData = ({ cityData }) => {
  const [formatedTime, setFormattedTime] = useState("");

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const date = new Date();
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setFormattedTime(time);
    };

    updateTime();

    const intervalId = setInterval(updateTime, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  if (!cityData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="weather-data">
      <span>Current Time: {formatedTime}</span>
      <h1>Today's Weather for {cityData.city}</h1>
      <span>Curent Temp: {cityData.temps[cityData.temps.length - 1]} °C</span>
      <span>Max Temp: {cityData.maxTemp} °C</span>
      <span>Min Temp: {cityData.minTemp} °C</span>
      <span>Avg Temp: {cityData.avgTemp} °C</span>
      <span>Dominant Weather: {cityData.dominantWeather}</span>

      {cityData.alerts && cityData.alerts.length > 0 && (
        <div className="alerts">
          <span>Alert:</span>
          <span className="alert-message">
            {cityData.alerts[cityData.alerts.length - 1]}
          </span>
        </div>
      )}
    </div>
  );
};

export default WeatherData;

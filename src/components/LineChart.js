// LineChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ summary }) => {
  const data = {
    labels: summary.dates,
    datasets: [
      {
        label: `Average Temperature in ${summary.city}`,
        data: summary.avgTemps,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Daily Average Temperature in ${summary.city}`,
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default LineChart;

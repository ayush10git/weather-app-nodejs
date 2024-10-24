# Weather Application

This Weather Application uses OpenWeatherApi to fetch weather data of Delhi, Mumbai, Hyderabad, Chennai, Kolkata and Bangalore and show weather conditions and set alert by entering a threshold temperature in Celsius.

#Setting Up the Backend - Node.js

## Installation

Ensure you have Node.js and MongoDB installed before starting.
1. Clone the repository:

```bash
git clone https://github.com/ayush10git/weather-app-nodejs
```

2. Install the required dependencies:

```bash
npm install
```

3. Create a .env file at the root of the project and add the following variables:
   
   You can use my mongodb which I use for testing.
   
   I have also provided OpenWeather API Key
```bash
MONGO_URI=mongodb+srv://ayushg31:ayush123@ayushcluster.slpkxto.mongodb.net
PORT=4000
CORS_ORIGIN=http://localhost:3000
API_KEY=b22e58f74c301a052be246f896be82d5
```

## Running the App
To start the app in development mode, use:
```bash
npm run dev
```

By default, the server will run on http://localhost:4000 (or the port you specified in your .env file).

## Dependencies
The following are the key dependencies for the project:

express: Minimalist web framework for Node.js.

mongoose: MongoDB object modeling for Node.js.

dotenv: Loads environment variables from a .env file.

nodemon: Restarts the server when file changes are detected (for development).

custom utils: convertKelvinToCelsius.

You can install all dependencies using:
```bash
npm install
```

## API Endpoints

1. Fetch Weather Data

   POST http://localhost:4000/api/weather/update

   Fetches the weather data of all the cities mentioned and sets Threshold temperature.

   Request:
   ```json
   {
    "threshold": 29 
   }
   ```
   Response:
   ```json
   {
    "message": "Weather data updated and summaries calculated",
    "summaries": [
        {
            "_id": "671aa579eafe9a84e5bbeb2f",
            "city": "Mumbai",
            "date": "2024-10-24",
            "maxTemp": 28.99,
            "minTemp": 28.99,
            "temps": [
                28.99,
                28.99,
                28.99,
                28.99,
                28.99,
                28.99,
                28.99,
                28.99,
                28.99
            ],
            "alerts": [],
            "avgTemp": 28.99,
            "dominantWeather": "Haze",
            "__v": 8
        },
        {
            "_id": "671aa578eafe9a84e5bbeb2b",
            "city": "Delhi",
            "date": "2024-10-24",
            "maxTemp": 23.05,
            "minTemp": 23.05,
            "temps": [
                23.05
            ],
            "alerts": [],
            "avgTemp": 23.05,
            "dominantWeather": "Haze",
            "__v": 0
        },
        {
            "_id": "671aa579eafe9a84e5bbeb31",
            "city": "Mumbai",
            "date": "2024-10-24",
            "maxTemp": 28.99,
            "minTemp": 28.99,
            "temps": [
                28.99
            ],
            "alerts": [],
            "avgTemp": 28.99,
            "dominantWeather": "Haze",
            "__v": 0
        },
        {
            "_id": "671aa579eafe9a84e5bbeb37",
            "city": "Chennai",
            "date": "2024-10-24",
            "maxTemp": 27.72,
            "minTemp": 27.72,
            "temps": [
                27.72
            ],
            "alerts": [],
            "avgTemp": 27.72,
            "dominantWeather": "Mist",
            "__v": 0
        },
        {
            "_id": "671aa579eafe9a84e5bbeb35",
            "city": "Chennai",
            "date": "2024-10-24",
            "maxTemp": 27.72,
            "minTemp": 27.23,
            "temps": [
                27.72,
                27.72,
                27.72,
                27.72,
                27.72,
                27.72,
                27.72,
                27.72,
                27.23
            ],
            "alerts": [],
            "avgTemp": 27.67,
            "dominantWeather": "Mist",
            "__v": 8
        },
        {
            "_id": "671aa578eafe9a84e5bbeb29",
            "city": "Delhi",
            "date": "2024-10-24",
            "maxTemp": 23.05,
            "minTemp": 23.05,
            "temps": [
                23.05,
                23.05,
                23.05,
                23.05,
                23.05,
                23.05,
                23.05,
                23.05,
                23.05
            ],
            "alerts": [],
            "avgTemp": 23.05,
            "dominantWeather": "Haze",
            "__v": 8
        }
    ]
   }  
   ```

2. Fetch Average Temperature data day wise for visualisation

   GET http://localhost:4000/api/weather/avg

   Response:
   ```json
   {
    "message": "Average temperature summary updated for today and historical data",
    "updatedAvgTempSummaries": [
        {
            "_id": "67166d17d70d09269ef3bcf4",
            "city": "Delhi",
            "dates": [
                "2024-10-21",
                "2024-10-22",
                "2024-10-23",
                "2024-10-24"
            ],
            "avgTemps": [
                26.93,
                26.76,
                25.05,
                23.05
            ],
            "__v": 3
        },
        {
            "_id": "67166d17d70d09269ef3bcf7",
            "city": "Mumbai",
            "dates": [
                "2024-10-21",
                "2024-10-22",
                "2024-10-23",
                "2024-10-24"
            ],
            "avgTemps": [
                29.4,
                30.15,
                30.66,
                28.99
            ],
            "__v": 3
        },
        {
            "_id": "67166d17d70d09269ef3bcfa",
            "city": "Chennai",
            "dates": [
                "2024-10-21",
                "2024-10-22",
                "2024-10-23",
                "2024-10-24"
            ],
            "avgTemps": [
                29.27,
                29.59,
                29.74,
                27.72
            ],
            "__v": 3
        },
        {
            "_id": "67166d17d70d09269ef3bcfd",
            "city": "Bangalore",
            "dates": [
                "2024-10-21",
                "2024-10-22",
                "2024-10-23",
                "2024-10-24"
            ],
            "avgTemps": [
                21.78,
                21.88,
                23.3,
                22.11
            ],
            "__v": 3
        },
        {
            "_id": "67166d17d70d09269ef3bd00",
            "city": "Kolkata",
            "dates": [
                "2024-10-21",
                "2024-10-22",
                "2024-10-23",
                "2024-10-24"
            ],
            "avgTemps": [
                26.59,
                27.82,
                25.83,
                25.97
            ],
            "__v": 3
        },
        {
            "_id": "67166d18d70d09269ef3bd03",
            "city": "Hyderabad",
            "dates": [
                "2024-10-21",
                "2024-10-22",
                "2024-10-23",
                "2024-10-24"
            ],
            "avgTemps": [
                24.98,
                24.14,
                25.98,
                21.73
            ],
            "__v": 3
        }
     ]
   }
   ```

# To run tests
```bash
   npm test
   ```

## Note:
You can use tools like Postman

## Frontend - React.js

# Installation

Ensure you have Node.js and MongoDB installed before starting.
1. Clone the repository:

```bash
git clone https://github.com/ayush10git/weather-app-nodejs/tree/frontend
```

2. Install the required dependencies:

```bash
npm install
```

## Running the App
To start the app in development mode, use:
```bash
npm start
```

# Note: Make sure the Backend is Running, while running the React App.

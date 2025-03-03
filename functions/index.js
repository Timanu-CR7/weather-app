// const functions = require("firebase-functions");
// const axios = require("axios");

// exports.getWeather = functions.https.onRequest(async (req, res) => {
//   try {
//     const city = req.query.city;
//     if (!city) {
//       return res.status(400).json({error: "City is required"});
//     }

//     const apiKey = "deb33af395e9ac03d3713d5a4f69fd41";
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

//     const response = await axios.get(url);
//     const weather = response.data;

//     res.json({
//       location: weather.name,
//       temperature: weather.main.temp,
//       description: weather.weather[0].description,
//     });
//   } catch (error) {
//     res.status(500).json({error: "Unable to fetch weather"});
//   }
// });


const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const fetch = require("node-fetch");

const API_KEY = "deb33af395e9ac03d3713d5a4f69fd41";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

exports.getWeather = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({error: "City parameter is required"});
    }

    try {
      const apiUrl=`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}`+
    `&units=metric`;
      const response = await fetch(apiUrl);
      const weatherData = await response.json();

      if (response.status !== 200) {
        return res.status(response.status).json({error: weatherData.message});
      }

      res.set("Access-Control-Allow-Origin", "*");
      res.json({
        location: weatherData.name,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
      });
    } catch (error) {
      res.status(500).json({error: "Failed to fetch weather data"});
    }
  });
});


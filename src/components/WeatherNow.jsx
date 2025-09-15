import React, { useState } from "react";
import axios from "axios";

const WeatherNow = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    try {
      setError("");
      setWeather(null);

      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );

      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        setError("City not found!");
        return;
      }

      const { latitude, longitude, name, country } = geoRes.data.results[0];

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const data = weatherRes.data.current_weather;

      setWeather({
        city: `${name}, ${country}`,
        temperature: data.temperature,
        wind: data.windspeed,
        code: data.weathercode,
      });
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#12b2de] from-10% via-[#3d669b] via-50% to-[#565E8D] p-4">
      <div className="bg-gradient-to-br from-[#106754] via-[#3D8E9B] to-[#45529b] w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
          🌤 Weather Now
        </h1>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-white border border-gray-300 bg-transparent placeholder-gray-300 outline-none"
          />
          <button
            onClick={getWeather}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold"
          >
            Check
          </button>
        </div>

        {error && <p className="text-red-300 text-center mt-4">{error}</p>}

        {weather && (
          <div className="bg-white text-black p-6 rounded-2xl shadow-xl text-center mt-8">
            <h2 className="text-lg sm:text-xl font-bold">{weather.city}</h2>
            <p className="text-2xl mt-2">{weather.temperature}°C</p>
            <p className="mt-1">💨 Wind: {weather.wind} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherNow;

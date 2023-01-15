import request from "superagent";
const APIkey = process.env.REACT_APP_WEATHER_API_KEY;
const baseUrl = "http://api.weatherapi.com/v1";
const currentUrl = "current.json";
const focastUrl = "focast.json";

export const getWeatherApi = (city) => {
  request
    .get(`${baseUrl}/${currentUrl}?key=${APIkey}&p=${city}`)
    .then((res) => res.body);
};

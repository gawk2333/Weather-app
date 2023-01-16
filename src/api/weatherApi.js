import request from "superagent";
const APIkey = process.env.REACT_APP_WEATHER_API_KEY;
const baseUrl = "http://api.weatherapi.com/v1";
const currentUrl = "current.json";
// const focastUrl = "focast.json";

export const getWeatherByGeoPositionApi = async ({ lat, lng }) => {
  return request
    .get(`${baseUrl}/${currentUrl}?key=${APIkey}&q=${lat},${lng}`)
    .then((res) => {
      return res.body;
    });
};

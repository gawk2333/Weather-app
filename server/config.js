// const mongoURI = "mongodb://0.0.0.0:27017/weatherapp";
const mongoURI = process.env.mongoURI;

module.exports = { mongoURI };

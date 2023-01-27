const mongoConfig = {
  mongoURI: process.env.mongoURI || "mongodb://0.0.0.0:27017/weatherapp",
  dbConnectionOptions: {
    db: {
      native_parser: true,
    },
  },
};

module.exports = { mongoConfig };

const path = require("path");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const dbConnections = require("./db");

dbConnections.initDefaultConnection().then(async () => {
  console.log(" CONNECTED TO MONGO ");
});

const server = express();
server.use(methodOverride("_method"));
server.use(express.json());
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, "./public")));

const userRoute = require("./routes/user.route");
const markerRoute = require("./routes/marker.route");

server.use("/api/v1/users", userRoute);
server.use("/api/v1/markers", markerRoute);

module.exports = server;

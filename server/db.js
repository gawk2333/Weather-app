const mongoURI = require("./config").mongoURI;
const mongoose = require("mongoose");
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

module.exports = conn;

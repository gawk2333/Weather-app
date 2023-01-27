const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const UserModel = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  password: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  token: {
    type: String,
    default: "",
  },
  markers: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", UserModel);

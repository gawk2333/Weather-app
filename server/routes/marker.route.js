const express = require("express");
const router = express.Router();

const {
  createMarker,
  deleteMarker,
} = require("../controllers/marker.controller");

router.post("/create", createMarker);

router.delete("/delete", deleteMarker);

module.exports = router;

const conn = require("../db");

const createMarker = async (req, res) => {
  try {
    // Get user input
    const { email, marker } = req.body;

    // Validate user input
    if (!(email && marker)) {
      return res.json({
        error: true,
        message: "Invalid request.",
      });
    }

    const requestedUser = await conn.db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (!requestedUser) {
      return res.json({
        error: true,
        message: "User does not exist.",
      });
    }

    const result = await conn
      .collection("users")
      .findOneAndUpdate(
        { email: email.toLowerCase() },
        { $push: { markers: marker } }
      );

    if (result.error) {
      return res.json({
        error: true,
        message: "Database error.",
      });
    }
    // return new user
    return res.json({
      error: false,
      message: "Marker created.",
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteMarker = async (req, res) => {
  try {
    // Get user input
    const { email, marker } = req.body;

    // Validate user input
    if (!(email && marker)) {
      return res.json({
        error: true,
        message: "Invalid request.",
      });
    }

    const requestedUser = await conn.db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (!requestedUser) {
      return res.json({
        error: true,
        message: "User does not exist.",
      });
    }
    const filteredMarkers = requestedUser.markers.filter(
      (m) => m.id !== marker.id
    );

    const result = await conn
      .collection("users")
      .findOneAndUpdate(
        { email: email.toLowerCase() },
        { $set: { markers: filteredMarkers } }
      );

    if (result.error) {
      return res.json({
        error: true,
        message: "Database error.",
      });
    }
    // return new user
    return res.json({
      error: false,
      message: "Marker deleted.",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createMarker,
  deleteMarker,
};

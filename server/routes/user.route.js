const express = require("express");
const router = express.Router();

const {
  userRegister,
  userLogin,
  validateAuthToken,
} = require("../controllers/user.controller");

// router for sign-up
router.post("/register", userRegister);

// router for sign-in
router.post("/login", userLogin);

router.post("/validation/:token", validateAuthToken);

module.exports = router;

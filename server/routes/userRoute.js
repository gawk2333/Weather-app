const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const conn = require("./db");

// router for sign-up
router.post("/register", async (req, res) => {
  let oldUser;
  try {
    // Get user input
    const { firstname, lastname, email, password } = req.body;

    // Validate user input
    if (!(email && password && firstname && lastname)) {
      return res.json({
        error: true,
        message: "All input is required.",
      });
    }

    // check if user already exist
    // Validate if user exist in our database
    oldUser = await conn.db
      .collection("users")
      .findOne({ email: email.toLowerCase() });

    if (oldUser) {
      return res.json({
        error: true,
        message: "User Already Exist. Please Login",
      });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await conn.db.collection("users").insertOne({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    delete user.password;
    // save user token
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.token = token;
    await conn.db
      .collection("users")
      .findOneAndUpdate({ email }, { $set: { token: token } });
    // return new user
    return res.json({
      error: false,
      user,
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// router for sign-in
router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.json({ error: true, message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await conn.db.collection("users").findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      delete user.password;
      // save user token
      user.token = token;
      await conn.db
        .collection("users")
        .findOneAndUpdate({ email }, { $set: { token: token } });

      // user
      return res.json({
        error: false,
        user,
      });
    }
    return res.json({
      error: true,
      message: "Invalid credentials",
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/validation/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.json({
        error: true,
        message: "Invalid request",
      });
    }

    const validatedUser = await conn.collection("users").findOne({ token });

    if (!validatedUser) {
      return res.json({
        error: true,
        message: "User does not exist",
      });
    }
    // refresh token
    const newToken = jwt.sign(
      { user_id: validatedUser._id, email: validatedUser.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    await conn.db
      .collection("users")
      .findOneAndUpdate(
        { email: validatedUser.email },
        { $set: { token: newToken } }
      );

    validatedUser.token = newToken;
    delete validatedUser.password;

    return res.json({
      error: false,
      user: validatedUser,
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

module.exports = router;

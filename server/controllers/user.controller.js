const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const conn = require("../db");

const userRegister = async (req, res) => {
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
      markers: [],
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    const registedUser = await conn.db
      .collection("users")
      .findOneAndUpdate({ email }, { $set: { token: token } });

    registedUser.value.token = token;
    delete registedUser.value.password;
    // return new user
    return res.json({
      error: false,
      user: registedUser.value,
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
};

const userLogin = async (req, res) => {
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

      const logedInUser = await conn.db
        .collection("users")
        .findOneAndUpdate({ email }, { $set: { token: token } });

      logedInUser.value.token = token;
      delete logedInUser.value.password;

      // user
      return res.json({
        error: false,
        user: logedInUser.value,
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
};

const validateAuthToken = async (req, res) => {
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
};

module.exports = {
  userRegister,
  userLogin,
  validateAuthToken,
};
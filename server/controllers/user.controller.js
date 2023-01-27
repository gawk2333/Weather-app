const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");

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
    oldUser = await UserModel.findOne({ email: email.toLowerCase() }).exec();

    if (oldUser) {
      return res.json({
        error: true,
        message: "User Already Exist. Please Login",
      });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = new UserModel({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      markers: [],
    });

    await user.save();
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    const [registedUser] = await UserModel.where({ email: email })
      .set([{ token: token }])
      .select({ password: 0 })
      .exec();

    // return new user
    return res.json({
      error: false,
      user: registedUser,
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
    const user = await UserModel.findOne({ email }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      const [loggedInUser] = await UserModel.where({ email: email })
        .set([{ token: token }])
        .select({
          password: 0,
        })
        .exec();

      // user
      return res.json({
        error: false,
        user: loggedInUser,
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

    const validatedUser = await UserModel.findOne({ token }).exec();
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
    const [refreshedUser] = await UserModel.where({
      email: validatedUser.email,
    })
      .set([{ token: newToken }])
      .select({ password: 0 })
      .exec();

    return res.json({
      error: false,
      user: refreshedUser,
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

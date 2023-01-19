const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const conn = require('./db')

// router for sign-up
router.post('/register', async (req, res) => {
  let oldUser
  try {
    console.log('req.body', req.body)
    // Get user input
    const { firstname, lastname, email, password } = req.body

    // Validate user input
    if (!(email && password && firstname && lastname)) {
      res.status(400).send('All input is required')
    }

    // check if user already exist
    // Validate if user exist in our database
    oldUser = await conn.db.collection('users').findOne({ email: email.toLowerCase() })
    console.log('olduser', oldUser)
    if (oldUser) {
      return res.status(409).json({
        message: 'User Already Exist. Please Login'
      })
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10)

    // Create user in our database
    const user = await conn.db.collection('users').insertOne({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword
    })
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    )
    // save user token
    user.token = token

    // return new user
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
  }
  // Our register logic ends here
})

// router for sign-in
router.post('/login', async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body
    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required')
    }
    // Validate if user exist in our database
    const user = await conn.db.collection('users').findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
        }
      )

      // save user token
      user.token = token

      // user
      res.json(user)
      next()
    }
    res.status(400).send('Invalid Credentials')
    next()
  } catch (err) {
    console.log(err)
  }
  // Our register logic ends here
})

module.exports = router

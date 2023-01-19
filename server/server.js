const path = require('path')
const express = require('express')
require('dotenv').config()
const resolve = require('path').resolve;
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
// const cors = require('cors')
const server = express()
server.use(methodOverride('_method'))
server.use(express.json())
server.use(bodyParser.json())
server.use(express.static(path.join(__dirname, './public')))
server.use('/fonts', express.static(resolve(__dirname, './fonts')));
// server.use(cors('*'))

const userRoute = require('./routes/userRoute')

server.use('/api/v1/users', userRoute)

module.exports = server

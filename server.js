const express = require('express')
const app = express()
const nEnv = app.get('env')
const os = require('os')

// Setup ENV
require('dotenv').config()

require('./api/v1/users/user.model')

// Express config
require('./config/express')(app)

// Mongoose config
require('./config/mongoose')()

// Passport config
require('./config/passport')

// Routes
require('./config/routes')(app)

const config = require('./config/config')

app.listen(config.port)

console.log(`Server Listening on port ${config.port}`)
if (nEnv === 'development') {
  console.log(`Web App: http://localhost:${config.port}/`)
  console.log(`Web App: http://localhost:${config.port}/api`)
} else {
  console.log(`Web App: http://${os.hostname()}:${config.port}/`)
  console.log(`Web App: http://${os.hostname()}:${config.port}/api`)
}

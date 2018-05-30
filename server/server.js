const express = require('express')
const app = express()
const nEnv = app.get('env')
const os = require('os')
const appInsights = require('applicationinsights')
// Setup ENV
require('dotenv').config()
const statusMonitor = require('express-status-monitor')({
  title: 'MCPR Load'
})
app.use(statusMonitor)

app.get('/status', statusMonitor.pageRoute)

const config = require('./config/config')

if (nEnv === 'production' && config.AIIK) {
  appInsights.setup(config.AIIK).start()
}

require('./api/v1/plugins/plugin.model')(config)
require('./api/v1/users/user.model')(config)
require('./api/v1/versions/versions.model')(config)

// Express config
require('./config/express')(app)

// Mongoose config
require('./config/mongoose')()

// Routes
require('./config/routes')(app)

// Error handler middleware
require('./config/middleware')(app)

app.listen(config.port)

console.log(`Server Listening on port ${config.port}`)
if (nEnv === 'development') {
  console.log(`Web App: http://localhost:${config.port}/`)
  console.log(`Web App: http://localhost:${config.port}/api`)
} else {
  console.log(`Web App: http://${os.hostname()}:${config.port}/`)
  console.log(`Web App: http://${os.hostname()}:${config.port}/api`)
}

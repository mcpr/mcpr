const express = require('express')
const next = require('next')
const os = require('os')

require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

app
  .prepare()
  .then(() => {
    const server = express()

    const statusMonitor = require('express-status-monitor')({
      title: 'MCPR Load'
    })
    server.use(statusMonitor)

    server.get('/status', statusMonitor.pageRoute)

    const config = require('./config/config')

    // Express config
    require('./config/express')(server)

    // Mongoose config
    require('./config/mongoose')()

    // Routes
    require('./config/routes')(server, app)

    // Error handler middleware
    require('./config/middleware')(server)

    server.listen(config.port)

    console.log(`Server Listening on port ${config.port}`)
    if (dev) {
      console.log(`Web App: http://localhost:${config.port}/`)
      console.log(`Web App: http://localhost:${config.port}/api`)
    } else {
      console.log(`Web App: http://${os.hostname()}:${config.port}/`)
      console.log(`Web App: http://${os.hostname()}:${config.port}/api`)
    }
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })

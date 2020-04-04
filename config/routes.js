const express = require('express')
const config = require('./config')

const router = express.Router()

module.exports = (server, app) => {
  const handle = app.getRequestHandler()

  router.get(/^(?!.*(docs|api))/, (req, res) => {
    return handle(req, res)
  })

  require('../api/api')(server, config)

  server.use('/', router)
}

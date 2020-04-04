const express = require('express')
const config = require('./config')

const router = express.Router()

module.exports = (app) => {
  router.get(/^(?!.*(docs|api))/, (req, res, next) => {
    // return handle(req, res)
    return next()
  })

  require('../api/api')(app, config)

  app.use('/', router)
}

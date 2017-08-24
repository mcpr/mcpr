const express = require('express')
const apiRouter = express.Router()
const mongoose = require('mongoose')

module.exports = function (app, config) {
  const pkg = require(config.projectPath + '/package.json')
  /**
   * GET /api/v1
   */
  apiRouter.get('/', (req, res) => {
    res.json({
      name: 'MCPR API',
      version: pkg.version,
      homepage: pkg.homepage
    })
  })

  /**
   * GET /api/plugins
   */

  apiRouter.use('/plugins', require('./plugins')(config))
  apiRouter.use('/users', require('./users')(config))
  apiRouter.use('/versions', require('./versions')(config))
  /**
   * @api {get} /healthcheck Health Check
   * @apiName HealthCheck
   * @apiGroup Health
   *
   * @apiSuccess {String} nodeCheck       Status of the Node check.
   * @apiSuccess {String} dbCheck       Status of the database connection.
   *
   * @apiExample {curl} Example usage:
   *     curl -i https://registry.hexagonminecraft.com/api/v1/healthcheck
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "nodeCheck": {
   *          "status": "ok"
   *       },
   *       "dbCheck": {
   *          "status": "connected"
   *       }
   *     }
   */
  apiRouter.get('/healthcheck', (req, res) => {
    let mongoConnection
    if (mongoose.connection.readyState === 0) {
      mongoConnection = 'disconnected'
    }
    if (mongoose.connection.readyState === 1) {
      mongoConnection = 'connected'
    }
    if (mongoose.connection.readyState === 2) {
      mongoConnection = 'connecting'
    }
    if (mongoose.connection.readyState === 3) {
      mongoConnection = 'disconnecting'
    }

    res.json({
      nodeCheck: {
        status: 'ok'
      },
      dbCheck: {
        status: mongoConnection
      }
    })
  })

  return apiRouter
}

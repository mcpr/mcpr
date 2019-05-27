const express = require('express')
const config = require('./config')

const router = express.Router()

module.exports = app => {
  router.get(/^(?!.*(docs|api))/, (req, res) => {
    const url = req.originalUrl
    let pluginId = false

    if (url.includes('/plugin/')) {
      pluginId = url.replace('/plugin/', '')
    }

    return res.render('app', {
      currentUrl: `${config.externalUrl}${req.originalUrl}`,
      pluginName: pluginId,
      gaCode: config.gaCode
    })
  })

  require(config.rootPath + '/api/api')(app, config)

  app.use('/', router)
}

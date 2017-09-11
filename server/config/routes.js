const express = require('express')
const config = require('./config')

module.exports = function (app) {
  const router = express.Router()
  router.get(/^(?!.*(docs|api))/, (req, res) => {
    let url = req.originalUrl
    let pluginId = false
    console.log(req.originalUrl)
    if (url.includes('/plugin/')) {
      pluginId = url.replace('/plugin/', '')
    }
    res.render('app', {
      currentUrl: 'https://registry.hexagonminecraft.com' + req.originalUrl,
      pluginName: pluginId,
      gaCode: config.gaCode
    })
  })

  require(config.rootPath + '/api/api')(app, config)

  app.use('/', router)
}

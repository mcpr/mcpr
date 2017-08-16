const express = require('express')

module.exports = function (app) {
  const router = express.Router()
  router.get(/^(?!.*(docs))/, (req, res) => {
    let url = req.originalUrl
    let pluginId = false
    console.log(req.originalUrl)
    if (url.includes('/plugin/')) {
      pluginId = url.replace('/plugin/', '')
    }
    res.render('app', {
      currentUrl: 'https://registry.hexagonminecraft.com' + req.originalUrl,
      pluginName: pluginId
    })
  })

  require('../api/api')(app)

  app.use('/', router)
}

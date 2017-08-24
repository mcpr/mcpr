module.exports = function (config) {
  const express = require('express')
  const router = express.Router()
  const jwt = require('express-jwt')
  const auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
  })

  const controller = require('./plugin.controller')
  const bukkitController = require('./plugin-bukkit.controller')(config)

  const after = function (req, res) {
    if (req.plugin) {
      let plugin = req.plugin.toObject()
      return res.json(plugin)
    }
    if (req.bukkitPlugin) {
      let plugin = req.bukkitPlugin
      return res.json(plugin)
    }
    if (req.plugins) {
      let plugins = req.plugins
      return res.json(plugins)
    }
    if (req.download) {
      let download = req.download
      return res.json(download)
    }
    if (req.bukkitPlugins) {
      return res.json(req.bukkitPlugins)
    }
    if (req.file) {
      return res.send({
        message: 'Successfully uploaded file!',
        file: req.file
      })
    } else {
      res.status(204).end()
    }
  }

  router.get('/', controller.all, after)
  router.get('/search', controller.search)
  router.post('/', auth, controller.create, after)

  // bukkitdev
  router.get('/@bukkitdev/:id', bukkitController.show, after)
  router.get('/@bukkitdev', bukkitController.all, after)

  router.get('/:id', controller.show, after)
  router.put('/:id', auth, controller.update, after)
  router.delete('/:id', auth, controller.delete, after)
  router.get('/:id/download', controller.download)

  return router
}

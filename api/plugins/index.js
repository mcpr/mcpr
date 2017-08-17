const express = require('express')
const router = express.Router()

const controller = require('./plugin.controller')
const bukkitController = require('./plugin-bukkit.controller')

const after = function (req, res) {
  if (req.plugin) {
    let plugin = req.plugin.toObject()
    res.json(plugin)
  }
  if (req.bukkitPlugin) {
    let plugin = req.bukkitPlugin
    res.json(plugin)
  }
  if (req.plugins) {
    let plugins = req.plugins
    res.json(plugins)
  }
  if (req.bukkitPlugins) {
    res.json(req.bukkitPlugins)
  } else {
    res.status(204).end()
  }
}

router.get('/', controller.all, after)
router.post('/search', controller.search)
router.post('/', controller.create, after)

// bukkitdev
router.get('/@bukkitdev/:id', bukkitController.show, after)
router.get('/@bukkitdev', bukkitController.all, after)

router.get('/:id', controller.show, after)
router.put('/:id', controller.update, after)
router.delete('/:id', controller.delete, after)

module.exports = router

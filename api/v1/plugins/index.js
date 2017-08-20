const express = require('express')
const router = express.Router()

const controller = require('./plugin.controller')
const bukkitController = require('./plugin-bukkit.controller')

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
router.post('/search', controller.search)
router.post('/', controller.create, after)

// bukkitdev
router.get('/@bukkitdev/:id', bukkitController.show, after)
router.get('/@bukkitdev', bukkitController.all, after)

router.get('/:id', controller.show, after)
router.put('/:id', controller.update, after)
router.delete('/:id', controller.delete, after)
router.get('/:id/download', controller.download)
router.get('/:id/download/:version', controller.download)
router.post('/:id/versions/:version/upload', controller.upload, after)

module.exports = router

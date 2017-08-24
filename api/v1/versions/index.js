const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')

module.exports = function (config) {
  const auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
  })

  const controller = require('./versions.controller')

  const after = function (req, res) {
    if (req.version) {
      let version = req.version.toObject()
      return res.json(version)
    }
    if (req.versions) {
      let versions = req.versions
      return res.json(versions)
    }
    if (req.download) {
      let download = req.download
      return res.json(download)
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
  router.post('/', auth, controller.create, after)

  router.get('/:pluginID', controller.showByPlugin, after)
  router.get('/:pluginID/:versionID', controller.show, after)
  router.put('/:pluginID/:versionID', auth, controller.update, after)
  router.delete('/:pluginID/:versionID', auth, controller.delete, after)
  router.get('/:pluginID/:versionID/download', controller.download)
  router.post('/:pluginID/:versionID/upload', controller.upload, after)

  return router
}

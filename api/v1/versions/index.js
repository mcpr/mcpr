const express = require('express')
const jwt = require('express-jwt')

const uploader = require('../../../lib/uploader')

const router = express.Router()

module.exports = config => {
  const auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
  })

  const ctrl = require('./versions.controller')

  router.get('/', ctrl.getVersions)
  router.post('/', auth, ctrl.createVersion)

  router.get('/:pluginId', ctrl.showByPlugin)
  router.get('/:pluginId/:versionId', ctrl.getVersion)
  router.put('/:pluginId/:versionId', auth, ctrl.updateVersion)
  router.delete('/:pluginId/:versionId', auth, ctrl.deleteVersion)
  router.get('/:pluginId/:versionId/download', ctrl.download)
  router.post('/:pluginId/:versionId/upload', auth, uploader, ctrl.upload)

  return router
}

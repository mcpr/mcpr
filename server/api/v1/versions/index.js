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

  router.get('/', ctrl.all)
  router.post('/', auth, ctrl.create)

  router.get('/:pluginID', ctrl.showByPlugin)
  router.get('/:pluginID/:versionID', ctrl.show)
  router.put('/:pluginID/:versionID', auth, ctrl.update)
  router.delete('/:pluginID/:versionID', auth, ctrl.delete)
  router.get('/:pluginID/:versionID/download', ctrl.download)
  router.post('/:pluginID/:versionID/upload', auth, uploader, ctrl.upload)

  return router
}

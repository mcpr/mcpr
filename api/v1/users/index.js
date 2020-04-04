const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')

const pluginController = require('../plugins/plugin.controller')

module.exports = config => {
  const auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
  })
  const controller = require('./user.controller')

  router.get('/', controller.showAll)
  router.post('/me/login', controller.login)
  router.get('/me/verify/:id/:verificationCode', controller.verify)
  router.post('/me/signup', controller.register)
  router.get('/me/profile', auth, controller.profileRead)
  router.put('/me/profile', auth, controller.updateProfile)
  router.put('/me/password', auth, controller.updatePassword)
  router.get('/:username', controller.getUser)
  router.get('/:username/plugins', pluginController.showByUser)

  return router
}

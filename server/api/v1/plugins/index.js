const express = require('express')
const jwt = require('express-jwt')

const controller = require('./plugin.controller')
const BukkitController = require('./plugin-bukkit.controller')

const router = express.Router()

module.exports = config => {
  const auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
  })
  const bukkitController = BukkitController(config)

  router.get('/', controller.all)
  router.get('/search', controller.search)
  router.post('/', auth, controller.create)

  // bukkitdev
  router.get('/@bukkitdev/:id', bukkitController.show)
  router.get('/@bukkitdev/:id/download', bukkitController.download)
  router.get('/@bukkitdev', bukkitController.all)

  router.get('/:id', controller.show)
  router.put('/:id', auth, controller.update)
  router.delete('/:id', auth, controller.delete)
  router.get('/:id/download', controller.download)

  return router
}

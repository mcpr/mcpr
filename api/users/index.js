const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const config = require('../../config/config')
const auth = jwt({
  secret: config.secret,
  userProperty: 'payload'
})
const authController = require('./authentication.controller')

router.get('/profile', auth, authController.profileRead)
router.get('/', authController.showAll)
router.post('/signup', authController.register)
router.post('/login', authController.login)

module.exports = router

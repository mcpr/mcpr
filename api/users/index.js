const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const config = require('../../config/config');
const auth = jwt({
    secret: config.secret,
    userProperty: 'payload'
});
const controller = require('./profile.controller');

router.get('/profile', auth, controller.profileRead);
router.get('/', controller.showAll);
router.post('/', controller.create);

module.exports = router;
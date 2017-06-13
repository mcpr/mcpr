const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.MCPR_KEY,
    userProperty: 'payload'
});
const controller = require('./profile.controller');

router.get('/profile', auth, controller.profileRead);

module.exports = router

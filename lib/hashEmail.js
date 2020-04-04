const md5 = require('md5')

module.exports = email => md5(email.trim().toLowerCase())

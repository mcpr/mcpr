const md5 = require('md5')

module.exports = email => {
  return md5(email.trim().toLowerCase())
}

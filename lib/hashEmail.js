const md5 = require('md5')

module.exports = (email) => {
  let trimedEmail = email.trim()
  let lowercaseEmail = trimedEmail.toLowerCase()
  let hashedEmail = md5(lowercaseEmail)
  return hashedEmail
}

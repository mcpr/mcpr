const bcrypt = require('bcrypt')

module.exports = function (password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return reject(err)
      }
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          return reject(err)
        }
        return resolve(hash)
      })
    })
  })
}

const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports.showAll = function (req, res) {
  User
    .find()
    .exec(function (err, users) {
      if (err) {
        handleError(res, err)
      }
      res.status(200).json(users)
    })
}

module.exports.create = function (req, res, next) {
  let user = req.body

  return User
    .create(user, function (err, user) {
      if (err) {
        return handleError(res, err)
      }
      req.user = user
      next()
    })
}

function handleError (res, err) {
  console.log('ERROR: ' + err)
  return res.status(500).send(err)
}

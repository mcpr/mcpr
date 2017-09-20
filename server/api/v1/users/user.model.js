const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const getRandomString = function () {
  return require('crypto').randomBytes(16).toString('hex')
}
module.exports = function (config) {
  const key = config.secert
  const hashEmail = require(config.rootPath + '/lib/hashEmail')

  const userSchema = new Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    hashedEmail: String,
    website: String,
    github: String,
    gitlab: String,
    twitter: String,
    updatedAt: Date,
    __private: {
      verificationCode: String,
      unsubscribeCode: String
    }
  })

  userSchema.pre('save', function (next) {
    let user = this
    const hashPassword = require(config.rootPath + '/lib/hashPassword')

    if (user.isNew) {
      user.__private.verificationCode = getRandomString()
    }
    if (user.isModified('email') || user.isNew) {
      let hashedEmail = hashEmail(user.email)
      user.hashedEmail = hashedEmail
    }

    if (user.isModified('password') || user.isNew) {
      hashPassword(user.password).then((res) => {
        user.password = res
        next()
      }).catch((err) => {
        return next(err)
      })
    } else {
      return next()
    }
  })

  userSchema.post('find', function (result) {
    console.log('postfind')
    console.log('find() returned ' + JSON.stringify(result))
  })

  // Create method to compare password input to password saved in database
  userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  }

  userSchema.methods.generateJwt = function () {
    var expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)

    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000)
    }, key)
  }
  const model = mongoose.model('User', userSchema)
  return model
}

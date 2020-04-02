const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')

const hashEmail = require('../../../lib/hashEmail')
const config = require('../../../config/config')

const { Schema } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
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
    social: {
      website: String,
      github: String,
      gitlab: String,
      twitter: String
    },
    __private: {
      verificationCode: String,
      unsubscribeCode: String
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

userSchema.pre('save', async function (next) {
  try {
    const user = this

    if (user.isNew) {
      user.__private.verificationCode = uuid()
    }

    if (user.isModified('email') || user.isNew) {
      user.hashedEmail = hashEmail(user.email)
    }

    if (user.isModified('password') || user.isNew) {
      const hashedPass = await bcrypt.hash(user.password, 10)

      user.password = hashedPass
    }

    return next()
  } catch (err) {
    return next(err)
  }
})

// Create method to compare password input to password saved in database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.methods.generateJwt = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name
    },
    config.secret,
    {
      expiresIn: '7d'
    }
  )
}
const UserModel = mongoose.model('User', userSchema)

module.exports = { UserModel }

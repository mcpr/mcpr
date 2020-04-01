const mongoose = require('mongoose')
const User = mongoose.model('User')
const axios = require('axios')
const sendVerificationEmail = require('../../../lib/sendVerificationEmail')
/**
 * @api {get} /users/me/profile Get Current User
 * @apiName GetCurrentUser
 * @apiGroup Users
 *
 * @apiSuccess {String} _id         Your user ID
 * @apiSuccess {String} hashedEmail Your email address base64 hashed
 * @apiSuccess {String} email       Your email address
 * @apiSuccess {String} username    Your username
 * @apiSuccess {String} name        Your name
 * @apiSuccess {String} github      Your GitHub username
 * @apiSuccess {String} gitlab      Your GitLab username
 * @apiSuccess {String} website     Your website address
 * @apiSuccess {String} twitter     Your Twitter username
 *
 * @apiPermission authenticated
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Authorization: Bearer YOUR_JWT_TOKEN" -i https://mcpr.io/api/v1/users/me/profile
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5995e9242165660018bb0a8a",
 *       "hashedEmail": "f0c8830d585c2c3cfc1e7d310c3fe933",
 *       "email": "noah@prail.net",
 *       "username": "nprail",
 *       "name": "Noah Prail",
 *       "github": "nprail",
 *       "gitlab": "nprail",
 *       "website": "https://nprail.me",
 *       "twitter": "noahprail"
 *     }
 */
module.exports.profileRead = async (req, res, next) => {
  try {
    // If no user ID exists in the JWT return a 401
    if (!req.payload.id) {
      return res.status(401).json({
        message: 'UnauthorizedError: private profile'
      })
    }

    const user = await User.findById(req.payload.id)
      .select('-password')
      .select('-__private')
      .select('-__v')

    if (!user) {
      return handle404()
    }

    return res.status(200).json(user)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /users/:username Get User
 * @apiName GetUser
 * @apiGroup Users
 * @apiParam {String} username Username of user
 *
 * @apiSuccess {String} _id         User's user ID
 * @apiSuccess {String} hashedEmail User's email address base64 hashed
 * @apiSuccess {String} email       User's email address
 * @apiSuccess {String} username    User's username
 * @apiSuccess {String} name        User's name
 * @apiSuccess {String} github      User's GitHub username
 * @apiSuccess {String} gitlab      User's GitLab username
 * @apiSuccess {String} website     User's website address
 * @apiSuccess {String} twitter     User's Twitter username
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/users/nprail
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5995e9242165660018bb0a8a",
 *       "hashedEmail": "f0c8830d585c2c3cfc1e7d310c3fe933",
 *       "email": "noah@prail.net",
 *       "username": "nprail",
 *       "name": "Noah Prail",
 *       "github": "nprail",
 *       "gitlab": "nprail",
 *       "website": "https://nprail.me",
 *       "twitter": "noahprail"
 *     }
 */
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    })
      .select('-password')
      .select('-__private')
      .select('-__v')

    if (!user) {
      return handle404()
    }

    return res.status(200).json(user)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /users Request User List
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Array} users       List of users.
 *
 * @apiParam  {string}  [sort]  Return users sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return userse ordered by `updatedAt`, `username`, `name`, or `email` fields. Default is `updatedAt`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/users?sort=asc&order_by=username
 */
module.exports.showAll = async (req, res, next) => {
  try {
    const perPage = Math.max(0, req.query.per_page) || 50
    const page = Math.max(0, req.query.page)
    const sort = req.query.sort || 'desc'
    const orderBy = req.query.order_by || 'updatedAt'
    const sortObj = {}
    sortObj[orderBy] = sort

    const users = await User.find()
      .limit(perPage)
      .skip(perPage * page)
      .sort(sortObj)
      .select('-password')
      .select('-__private')
      .select('-__v')

    return res.status(200).json(users)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {post} /users/me/signup Signup
 * @apiName PostSignup
 * @apiGroup Users
 *
 * @apiParam {String} username  Username of new user
 * @apiParam {String} name      Name of new  user
 * @apiParam {String} email     Email address of new  user
 * @apiParam {String} password  Password of new  user
 *
 * @apiSuccess {Boolean} success     True or false success
 * @apiSuccess {String} message     Success message
 *
 * @apiExample {curl} Example usage:
 *     curl -i -X "POST" https://mcpr.io/api/v1/users/me/signup
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "message": "Successfully created new user."
 *     }
 */
module.exports.register = async (req, res, next) => {
  try {
    const { config } = req

    const resp = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${
        config.recaptchaKey
      }&response=${req.body.recaptchaResponse}`
    )
    const recaptchaRes = resp.data

    if (!recaptchaRes.success) {
      return res.status(500).json({
        success: false,
        message: 'Recaptcha invalid'
      })
    }

    if (!req.body.email || !req.body.password) {
      return res.json({
        success: false,
        message: 'Please enter email and password.'
      })
    }

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      name: req.body.name,
      password: req.body.password
    })

    const user = await newUser.save()

    // Attempt to save the user
    sendVerificationEmail(user, config)

    return res.json({
      success: true,
      message: 'Successfully created new user.'
    })
  } catch (err) {
    console.log(err)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'That email address or username already exists.'
      })
    }
    return res.status(500).json(err)
  }
}

module.exports.verify = async (req, res, next) => {
  try {
    const { id, verificationCode } = req.params

    const user = await User.findOne({
      _id: id,
      '__private.verificationCode': verificationCode
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Bad request'
      })
    }

    user.isVerified = true
    await user.save()

    return res.status(200).json({
      message: 'Verified'
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {post} /users/me/login Login
 * @apiName PostLogin
 * @apiGroup Users
 *
 * @apiParam {String} username  Your username
 * @apiParam {String} password  Your password
 *
 * @apiSuccess {Boolean} success  True or false success
 * @apiSuccess {String} token     JWT login token
 *
 * @apiExample {curl} Example usage:
 *     curl -i -X "POST" https://mcpr.io/api/v1/users/me/login
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5OTVlOTI0MjE2NTY2MDAxOGJiMGE4YSIsInVzZXJuYW1lIjoibnByYWlsIiwiaWF0IjoxNTAzMzE4MTIwLCJleHAiOjE1MDMzMjgyMDB9.CATgjmJm-qzq9IAYI5mFMjKe9LdFmF7pvBFMSNwDjLQ"
 *     }
 */
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({
      username
    })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    }

    if (!user.isVerified) {
      return res.status(403).send({
        success: false,
        verified: false,
        message: 'Your email address is not verified! Please check your email.'
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: 'Authentication failed. Incorrect username or password.'
      })
    }

    // Create token if the password matched and no error was thrown
    const token = user.generateJwt()

    return res.status(200).json({
      success: true,
      token
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {put} /users/me/profile Update Profile
 * @apiName PutProfile
 * @apiGroup Users
 *
 * @apiParam {String} [name]    Your name
 * @apiParam {String} [github]  Your GitHub username
 * @apiParam {String} [gitlab]  Your GitLab username
 * @apiParam {String} [website] Your website address
 * @apiParam {String} [twitter] Your Twitter username
 *
 * @apiPermission authenticated
 *
 * @apiSuccess {Boolean} success     True or false success
 * @apiSuccess {String} message     Success message
 *
 * @apiExample {curl} Example usage:
 *     curl -i -X "PUT" https://mcpr.io/api/v1/users/me/profile
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "message": "Profile updated!"
 *     }
 */
module.exports.updateProfile = async (req, res, next) => {
  try {
    const newUser = req.body
    const user = await User.findById(req.payload.id)

    user.name = newUser.name
    user.website = newUser.website
    user.github = newUser.github
    user.gitlab = newUser.gitlab
    user.twitter = newUser.twitter

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Profile updated!'
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {put} /users/me/password Update Password
 * @apiName PutPassword
 * @apiGroup Users
 *
 * @apiParam {String} current   Your current password
 * @apiParam {String} new       Your new password
 *
 * @apiPermission authenticated
 *
 * @apiSuccess {Boolean} success     True or false success
 * @apiSuccess {String} message     Success message
 *
 * @apiExample {curl} Example usage:
 *     curl -i -X "PUT" https://mcpr.io/api/v1/users/me/password
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "message": "Password updated!"
 *     }
 */
module.exports.updatePassword = async (req, res, next) => {
  try {
    const passwords = req.body

    const user = await User.findById(req.payload.id)

    const isMatch = await user.comparePassword(passwords.current)

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect current password.'
      })
    }

    user.password = passwords.new
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Password updated!'
    })
  } catch (err) {
    return next(err)
  }
}

const handle404 = () => {
  const err = new Error(
    '404: the resource that you requested could not be found'
  )
  err.name = 'NotFound'
  err.statusCode = 404

  throw err
}

const axios = require('axios')
const createError = require('http-errors')

const { UserModel } = require('./user.model')
const sendVerificationEmail = require('../../../lib/sendVerificationEmail')
const { paginateQuery } = require('../../../lib/paginate-query')

/**
 * @api {get} /users/me/profile Get Current User
 * @apiName GetCurrentUser
 * @apiGroup Users
 *
 * @apiSuccess {String} _id               Your user ID
 * @apiSuccess {String} hashedEmail       Your email address base64 hashed
 * @apiSuccess {String} email             Your email address
 * @apiSuccess {String} username          Your username
 * @apiSuccess {String} name              Your name
 * @apiSuccess {Object} social            Your social profiles
 * @apiSuccess {String} social.github     Your GitHub username
 * @apiSuccess {String} social.gitlab     Your GitLab username
 * @apiSuccess {String} social.website    Your website address
 * @apiSuccess {String} social.twitter    Your Twitter username
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
 *       "social": {
 *         "github": "nprail",
 *         "gitlab": "nprail",
 *         "website": "https://nprail.me",
 *         "twitter": "noahprail"
 *       }
 *     }
 */
module.exports.profileRead = async (req, res, next) => {
  try {
    // If no user ID exists in the JWT return a 401
    if (!req.payload.id) {
      return next(createError(401, 'You are not logged in.'))
    }

    const user = await UserModel.findById(req.payload.id)
      .select('-password')
      .select('-__private')
      .select('-__v')

    if (!user) {
      return next(createError(404))
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
 * @apiSuccess {String} _id               User's user ID
 * @apiSuccess {String} hashedEmail       User's email address base64 hashed
 * @apiSuccess {String} username          User's username
 * @apiSuccess {String} name              User's name *
 * @apiSuccess {Object} social            User's social profiles
 * @apiSuccess {String} social.github     User's GitHub username
 * @apiSuccess {String} social.gitlab     User's GitLab username
 * @apiSuccess {String} social.website    User's website address
 * @apiSuccess {String} social.twitter    User's Twitter username
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/users/nprail
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5995e9242165660018bb0a8a",
 *       "hashedEmail": "f0c8830d585c2c3cfc1e7d310c3fe933",
 *       "username": "nprail",
 *       "name": "Noah Prail",
 *       "social": {
 *         "github": "nprail",
 *         "gitlab": "nprail",
 *         "website": "https://nprail.me",
 *         "twitter": "noahprail"
 *       }
 *     }
 */
module.exports.getUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      username: req.params.username
    }).select('_id username name hashedEmail social')

    if (!user) {
      return next(createError(404))
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
 * @apiParam  {string}  [order_by]  Return users ordered by `username` or `name`fields. Default is `username`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/users?sort=asc&order_by=username
 */
module.exports.showAll = async (req, res, next) => {
  try {
    const users = await paginateQuery(
      UserModel,
      {
        perPage: req.query.per_page,
        page: req.query.page,
        sortDirection: req.query.sort || 'desc',
        orderBy: req.query.order_by || 'username'
      },
      {}
    ).select('_id username name hashedEmail social')

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
      `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptchaKey}&response=${req.body.recaptchaResponse}`
    )
    const recaptchaRes = resp.data

    if (!recaptchaRes || !recaptchaRes.success) {
      return next(createError(403, 'Recaptcha invalid'))
    }

    if (!req.body.email || !req.body.password) {
      return next(createError(401, 'Please enter email and password'))
    }

    const newUser = new UserModel({
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
    if (err.code === 11000) {
      return next(
        createError(409, `The username ${req.body.username} is already taken.`)
      )
    }

    return next(createError(500, err))
  }
}

module.exports.verify = async (req, res, next) => {
  try {
    const { id, verificationCode } = req.params

    const user = await UserModel.findOne({
      _id: id,
      '__private.verificationCode': verificationCode
    })

    if (!user) {
      return next(createError(400))
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

    if (!username || !password) {
      return next(createError(400, 'Username or password not specified.'))
    }

    const user = await UserModel.findOne({
      username
    })

    if (!user) {
      return next(
        createError(
          401,
          'Authentication failed. Incorrect username or password.'
        )
      )
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return next(
        createError(
          401,
          'Authentication failed. Incorrect username or password.'
        )
      )
    }

    if (!user.isVerified) {
      return next(
        createError(
          403,
          'Your email address is not verified! Please check your email.'
        )
      )
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
 * @apiParam {Object} [social]  Your social profiles
 * @apiParam {String} [social.github]  Your GitHub username
 * @apiParam {String} [social.gitlab]  Your GitLab username
 * @apiParam {String} [social.website] Your website address
 * @apiParam {String} [social.twitter] Your Twitter username
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
    const user = await UserModel.findById(req.payload.id)

    if (!user) {
      return next(createError(404))
    }

    const newUser = {
      name: req.body.name || user.name,
      social: { ...user.social, ...req.body.social }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.payload.id,
      newUser,
      { new: true }
    )

    return res.status(200).json(updatedUser)
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

    const user = await UserModel.findById(req.payload.id)
    if (!user) {
      return next(createError(404))
    }

    const isMatch = await user.comparePassword(passwords.current)

    if (!isMatch) {
      return next(createError(401, 'Incorrect current password.'))
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

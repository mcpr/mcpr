const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const axios = require('axios')
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
module.exports.profileRead = function (req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload.id) {
    res.status(401).json({
      message: 'UnauthorizedError: private profile'
    })
  } else {
    // Otherwise continue
    let query = User.findById(req.payload.id)
    query.select('-password')
    query.select('-__private')
    query.select('-__v')

    query.exec(function (err, user) {
      if (err) {
        return handleError(res, err)
      }
      if (user === null) {
        return handleError(res, {
          message: "The requested user doesn't seem to exist."
        })
      }
      res.status(200).json(user)
    })
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
module.exports.getUser = function (req, res) {
  let query = User.findOne({
    username: req.params.username
  })
  query.select('-password')
  query.select('-__private')
  query.select('-__v')

  query.exec(function (err, user) {
    if (err) {
      return handleError(res, err)
    }
    if (user === null) {
      return res.status(404).json({
        success: false,
        message: "The requested user doesn't seem to exist."
      })
    }
    res.status(200).json(user)
  })
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
module.exports.showAll = function (req, res) {
  let perPage = Math.max(0, req.query.per_page) || 50
  let page = Math.max(0, req.query.page)
  let sort = req.query.sort || 'desc'
  let orderBy = req.query.order_by || 'updatedAt'
  let sortObj = {}
  sortObj[orderBy] = sort

  let query = User.find()
    .limit(perPage)
    .skip(perPage * page)
    .sort(sortObj)

  query.select('-password')
  query.select('-__private')
  query.select('-__v')

  query.exec(function (err, users) {
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json(users)
  })
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
module.exports.register = (req, res) => {
  const config = req.config
  const sendVerificationEmail = require(config.rootPath +
    '/lib/sendVerificationEmail')

  axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${
        config.recaptchaKey
      }&response=${req.body.recaptchaResponse}`
    )
    .then(resp => {
      var recaptchaRes = resp.data
      console.log(recaptchaRes.success)
      if (recaptchaRes.success) {
        console.log(recaptchaRes.success)
        if (!req.body.email || !req.body.password) {
          res.json({
            success: false,
            message: 'Please enter email and password.'
          })
        } else {
          var newUser = new User({
            email: req.body.email,
            username: req.body.username,
            name: req.body.name,
            password: req.body.password
          })

          // Attempt to save the user
          newUser.save((err, user) => {
            if (err) {
              if (err.code === 11000) {
                return res.status(409).json({
                  success: false,
                  message: 'That email address or username already exists.'
                })
              }
              console.log(err)
              return res.status(500).json(err)
            }
            sendVerificationEmail(user, config)
            return res.json({
              success: true,
              message: 'Successfully created new user.'
            })
          })
        }
      } else {
        return res.status(500).json({
          success: false,
          message: 'Recaptcha invalid'
        })
      }
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json(err)
    })
}

module.exports.verify = (req, res) => {
  // const config = req.config
  console.log(req.params.verificationCode)
  let id = req.params.id
  let code = req.params.verificationCode
  User.findOne(
    {
      _id: id,
      '__private.verificationCode': code
    },
    function (err, user) {
      if (err) return handleError(res, err.name)
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Bad request'
        })
      }
      user.isVerified = true
      user.save(function (err, updatedTank) {
        if (err) return handleError(err.name)
        console.log(user)
        return res.json({
          message: 'Verified'
        })
      })
    }
  )
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
module.exports.login = function (req, res) {
  const config = req.config
  User.findOne(
    {
      username: req.body.username
    },
    function (err, user) {
      if (err) {
        handleError(res, err)
      }

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'Authentication failed. User not found.'
        })
      } else if (!user.isVerified) {
        return res.status(403).send({
          success: false,
          verified: false,
          message:
            'Your email address is not verified! Please check your email.'
        })
      } else {
        // Check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(
              {
                id: user._id,
                username: user.username
              },
              config.secret,
              {
                expiresIn: 5184000 // in seconds
              }
            )
            res.json({
              success: true,
              token: token
            })
          } else {
            res.status(401).send({
              success: false,
              message: 'Authentication failed. Incorrect username or password.'
            })
          }
        })
      }
    }
  )
}

/**
 * @api {put} /users/me/profile Update Profile
 * @apiName PutProfile
 * @apiGroup Users
 *
 * @apiParam {String} _id       Your user ID
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
module.exports.updateProfile = (req, res) => {
  let user = req.body
  User.findById(user._id, function (err, doc) {
    if (err) {
      handleError(res, err)
    }
    doc.name = user.name
    doc.website = user.website
    doc.github = user.github
    doc.gitlab = user.gitlab
    doc.twitter = user.twitter
    doc.save(function (err) {
      if (err) {
        handleError(res, err)
      }
      res.status(200).json({
        success: true,
        message: 'Profile updated!'
      })
    })
  })
}

/**
 * @api {put} /users/me/password Update Password
 * @apiName PutPassword
 * @apiGroup Users
 *
 * @apiParam {String} _id       Your user ID
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
module.exports.updatePassword = (req, res) => {
  let passwords = req.body

  User.findById(passwords.userID, function (err, user) {
    if (err) {
      handleError(res, err)
    }
    user.comparePassword(passwords.current, function (err, isMatch) {
      if (err) {
        return handleError(res, err)
      }
      if (isMatch && !err) {
        user.password = passwords.new
        user.save(function (err) {
          if (err) {
            return handleError(res, err)
          }
          return res.status(200).json({
            success: true,
            message: 'Password updated!'
          })
        })
      } else {
        return res.status(400).send({
          success: false,
          message: 'Incorrect current password.'
        })
      }
    })
  })
}

const handleError = function (res, err) {
  console.log('ERROR: ' + err)
  return res.status(500).json({
    success: false,
    message: err
  })
}

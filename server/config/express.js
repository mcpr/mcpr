const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const passport = require('passport')
const path = require('path')

const config = require('./config')
module.exports = function (app) {
  app.use(helmet())
  app.use(favicon(config.rootPath + '/public/favicon.ico'))
  app.use(morgan('dev'))
  app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  })) // session secret
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(function (req, res, next) {
    req.config = config
    return next()
  })

  // error handlers
  function error404Handler (err, req, res, next) {
    console.log(err)
    console.log('ERROR')
  }

  function unauthorisedError (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401)
      res.json({
        'message': err.name + ': ' + err.message
      })
    }
  }

  function catchAllError (err, req, res, next) {
    console.error(err.message)
    next(err)
  }

  app.use(catchAllError)
  app.use(error404Handler)
  app.use(unauthorisedError)

  app.use(express.static(config.rootPath + '/public'))

  const viewsDir = path.normalize(config.rootPath + '/views')
  app.set('views', viewsDir)
  app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.normalize(viewsDir + '/layouts')
  }))
  app.set('view engine', 'handlebars')
}

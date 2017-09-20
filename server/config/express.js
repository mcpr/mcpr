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

  let maxAge = 0
  if (app.get('env') === 'production') {
    maxAge = 14400000
  }

  var date = new Date()
  app.locals.deployVersion = Math.ceil(date.getTime() / 300000) * 300000

  app.use(express.static(config.rootPath + '/public', {
    maxAge: maxAge
  }))

  const viewsDir = path.normalize(config.rootPath + '/views')
  app.set('views', viewsDir)
  app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.normalize(viewsDir + '/layouts')
  }))
  app.set('view engine', 'handlebars')
}

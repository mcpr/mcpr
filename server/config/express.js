const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const path = require('path')

const config = require('./config')
module.exports = app => {
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
  app.use((req, res, next) => {
    req.config = config
    return next()
  })

  const maxAge = app.get('env') === 'production' ? 14400000 : 0
  app.locals.assetBase = config.cdnUrl ? config.cdnUrl : '/build'

  app.locals.deployVersion = new Date().getTime()

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

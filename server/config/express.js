const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const path = require('path')

const config = require('./config')

module.exports = app => {
  const publicDir = './server/public'

  app.use(helmet())
  app.use(favicon(`${publicDir}/favicon.ico`))

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined'))
  }

  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use((req, res, next) => {
    req.config = config
    return next()
  })

  const maxAge = app.get('env') === 'production' ? 14400000 : 0
  app.locals.assetBase = config.cdnUrl ? config.cdnUrl : '/build'

  app.locals.deployVersion = new Date().getTime()

  app.use(
    express.static(publicDir, {
      maxAge
    })
  )

  const viewsDir = path.resolve('./server/views')
  app.set('views', viewsDir)
  app.engine(
    'handlebars',
    exphbs({
      defaultLayout: 'main',
      layoutsDir: path.normalize(`${viewsDir}/layouts`)
    })
  )
  app.set('view engine', 'handlebars')
}

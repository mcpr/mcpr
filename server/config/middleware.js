const handleError = require('../lib/middleware/errors')

module.exports = app => {
  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        message: err.message
      })
    }

    return next(err)
  })

  app.use(handleError)
}

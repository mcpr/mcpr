module.exports = app => {
  app.use((err, req, res, next) => {
    console.error(err.message)
    next(err)
  })

  app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        message: err.message
      })
    }
  })
}

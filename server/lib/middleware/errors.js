const handleError = (err, req, res, next) => {
  console.log('ERROR:', err)

  return res.status(err.status || 500).json({
    success: false,
    name: err.name || 'InternalServerError',
    status: err.status || 500,
    message: (err && err.message) || err.toString()
  })
}

module.exports = handleError

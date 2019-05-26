const handleError = (err, req, res, next) => {
  console.log('ERROR: ' + err)

  if (err.statusCode === 404) {
    return res.status(404).json({
      name: 'NotFound',
      statusCode: 404,
      message: err.message
    })
  }

  return res.status(500).json({
    success: false,
    message: (err && err.message) || err.toString()
  })
}

module.exports = handleError

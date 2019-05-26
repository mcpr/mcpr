const handleError = (err, req, res, next) => {
  if (err.statusCode === 404) {
    return res
      .status(404)
      .send({
        name: 'NotFound',
        statusCode: 404,
        message: err.message
      })
      .end()
  }

  console.log('ERROR: ' + err)
  return res.status(500).json({
    success: false,
    message: (err && err.message) || err.toString()
  })
}

module.exports = handleError

const handleError = require('../lib/middleware/errors')

module.exports = app => {
  app.use(handleError)
}

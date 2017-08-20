module.exports = function (app) {
  const v1Router = require('./v1')(app)
  /**
   * GET /api
   */
  app.use('/api', v1Router)

  app.use('/api/v1', v1Router)
}

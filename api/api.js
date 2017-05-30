module.exports = function (app) {
    /**
     * GET /api/v1/
     */
    app.use('/api/v1', require('./v1/v1.js')(app));

    /**
     * GET /api/
     */
    app.use('/api', require('./v1/v1.js')(app));

}
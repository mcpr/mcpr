module.exports = function (app) {
    app.use('/api/v1/plugins', require('./plugins'))
     /**
     * GET /api/v1/
     */
    app.get('/api/v1/', function (req, res) {
        res.json({
            name: "MCPR API",
            version: pkg.version,
        });
    });
}
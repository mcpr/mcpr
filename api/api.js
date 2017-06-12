const pkg = require('../package.json');
const express = require('express');
const apiRouter = express.Router();

module.exports = function (app) {
    /**
     * GET /api
     */
    apiRouter.get('/', (req, res) => {
        res.json({
            name: "MCPR API",
            version: pkg.version,
            homepage: pkg.homepage
        });
    });

    /**
     * GET /api/plugins
     */
    apiRouter.use('/plugins', require('./plugins/index'));

    app.use('/api', apiRouter)
}
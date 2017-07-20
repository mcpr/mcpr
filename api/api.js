const pkg = require('../package.json');
const express = require('express');
const apiRouter = express.Router();
const mongoose = require('mongoose');

module.exports = function (app) {
    /**
     * GET /api
     */
    apiRouter.get('/', (req, res) => {
        res.json({
            name: 'MCPR API',
            version: pkg.version,
            homepage: pkg.homepage
        });
    });

    /**
     * GET /api/plugins
     */
    apiRouter.use('/plugins', require('./plugins/index'));
    apiRouter.use('/users', require('./users/index'));

    /**
     * @api {get} /healthcheck Health Check
     * @apiName HealthCheck
     * @apiGroup Health
     * 
     * @apiSuccess {String} node_check       Status of the Node check.
     * @apiSuccess {String} db_check       Status of the database connection. 
     * 
     * @apiExample {curl} Example usage:
     *     curl -i https://registry.hexagonminecraft.com/api/healthcheck
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "node_check": {
     *          "status": "ok"
     *       },
     *       "db_check": {
     *          "status": "connected"
     *       }
     *     }
     */
    apiRouter.get('/healthcheck', (req, res) => {
        let mongoConnection;
        if (mongoose.connection.readyState === 0) {
            mongoConnection = 'disconnected';
        }
        if (mongoose.connection.readyState === 1) {
            mongoConnection = 'connected';
        }
        if (mongoose.connection.readyState === 2) {
            mongoConnection = 'connecting';
        }
        if (mongoose.connection.readyState === 3) {
            mongoConnection = 'disconnecting';
        }

        res.json({
            node_check: {
                status: 'ok'
            },
            db_check: {
                status: mongoConnection
            }
        });
    });

    app.use('/api', apiRouter);
};
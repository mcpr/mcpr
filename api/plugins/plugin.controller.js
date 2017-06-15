const Plugin = require('./plugin.model');

exports.model = Plugin;

/**
 * @api {get} /plugins Request Plugin List
 * @apiName GetPlugins
 * @apiGroup Plugin
 * 
 * @apiSuccess {Array} plugins       List of plugins.
 * 
 * @apiExample {curl} Example usage:
 *     curl -i https://registry.hexagonminecraft.com/api/plugins
 */
exports.all = function (req, res, next) {
    Plugin
        .find({})
        .exec(function (err, plugins) {
            if (err) {
                return handleError(res, err);
            }
            if (!plugins) {
                return handle404(res);
            }
            req.plugins = plugins;
            next();
        });
};

/**
 * @api {post} /plugins Create Plugin
 * @apiName CreatePlugin
 * @apiGroup Plugin
 */
exports.create = function (req, res, next) {
    let plugin = req.body;

    return Plugin
        .create(req.body, function (err, plugin) {
            if (err) {
                return handleError(res, err);
            }
            if (!plugin) {
                return handle404(res);
            }
            req.plugin = plugin;
            next();
        });
};

/**
 * @api {get} /plugins/:id Get Plugin
 * @apiName GetPlugin
 * @apiGroup Plugin
 * @apiParam {String} id ID of plugin
 * 
 * @apiSuccess {String} _id       ID of plugin
 * @apiSuccess {String} short_description       A short description of the plugin
 * @apiSuccess {String} author       The author's user ID
 * @apiSuccess {Date} created       The date on which the plugin was created
 * @apiSuccess {String} title       The title of the plugin
 * @apiSuccess {Date} latest_version_date       The date on which the latest version was published
 * @apiSuccess {String} latest_version       Version number of the latest version
 * @apiSuccess {String} source       URL of the source code
 * @apiSuccess {Boolean} sourceGithub       Specifies whether or not the plugin source is hosted on GitHub
 * @apiSuccess {Array} flavors       List of supported Minecraft flavors
 * @apiSuccess {String} readme       The README.md file
 * @apiSuccess {String} license       The license of the plugin
 * @apiSuccess {Array} keywords       List of plugin keywords
 * 
 * @apiExample {curl} Example usage:
 *     curl -i https://registry.hexagonminecraft.com/api/plugins/dynmap
 */
exports.show = function (req, res, next) {
    Plugin
        .findById(req.params.id)
        .exec(function (err, plugin) {
            if (err) {
                return handleError(res, err);
            }
            if (!plugin) {
                return handle404(res, req.params.id);
            }
            req.plugin = plugin;
            next();
        });
};

exports.update = function (req, res) {
    var updatedPlugin = req.body;
    updatedPlugin.updated = Date.now();

    Plugin
        .findById(req.params.id)
        .exec(function (err, plugin) {
            if (err) {
                return handleError(res, err);
            }
            if (!plugin) {
                return handle404(res);
            }
            Plugin
                .update({
                    '_id': req.params.id
                }, updatedPlugin)
                .exec(function () {
                    return res.status(204).end();
                });
        });
};

exports.delete = function (req, res, next) {
    let pluginId = req.params.id;
    Plugin
        .remove({
            '_id': pluginId
        })
        .exec(function (err, num) {
            if (err) {
                return handleError(res, err);
            }
            if (num === 0) {
                return res.status(498).end();
            }
            next();
        });
};

function handleError(res, err) {
    console.log('ERROR: ' + err);
    return res.status(500).send(err);
}

function handle404(res) {
    res.status(404);
    res.json({
        name: 'NotFound',
        statusCode: 404,
        message: '404: the resource that you requested could not be found'
    });
}
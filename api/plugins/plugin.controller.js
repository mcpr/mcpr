const Plugin = require('./plugin.model');

exports.model = Plugin;

exports.all = function (req, res, next) {
    Plugin
        .find({})
        .exec(function (err, plugins) {
            if (err) return handleError(res, err);
            if (!plugins) return res.status(404).end();
            req.plugins = plugins;
            next();
        });
}


exports.create = function (req, res, next) {
    let plugin = req.body;

    return Plugin
        .create(req.body, function (err, plugin) {
            if (err) return handleError(res, err);
            if (!plugin) return res.status(404);
            req.plugin = plugin;
            next();
        });
}

exports.show = function (req, res, next) {
    Plugin
        .findById(req.params.id)
        .exec(function (err, plugin) {
            if (err) return handleError(res, err);
            if (!plugin) return res.status(404).end();
            req.plugin = plugin;
            next();
        });
}

exports.update = function (req, res) {
    var updatedPlugin = req.body;
    updatedPlugin.updated = Date.now();

    Plugin
        .findById(req.params.id)
        .exec(function (err, plugin) {
            if (err) return handleError(res, err);
            if (!plugin) return res.status(404).end();
            Plugin
                .update({
                    '_id': req.params.id
                }, updatedPlugin)
                .exec(function () {
                    return res.status(204).end();
                });
        });
}

exports.delete = function (req, res, next) {
    var pluginId = req.params.id
    Plugin
        .remove({
            '_id': pluginId
        })
        .exec(function (err, num) {
            if (err) return handleError(res, err);
            if (num == 0) return res.status(498).end();
            next();
        });
}

function handleError(res, err) {
    console.log("ERROR: " + err);
    return res.status(500).send(err);
}
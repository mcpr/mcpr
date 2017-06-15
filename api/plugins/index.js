const express = require('express');
const router = express.Router();

const controller = require('./plugin.controller');
const bukkitController = require('./plugin-bukkit.controller');

const after = function (req, res) {
    if (req.plugin) {
        let plugin = req.plugin.toObject();
        res.json(plugin);
    }
    if (req.bukkitPlugin) {
        let plugin = req.bukkitPlugin;
        res.json(plugin);
    }
    if (req.plugins) {
        let plugins = req.plugins;
        res.json(req.plugins);
    }
    if (req.bukkitPlugins) {
        res.json(req.bukkitPlugins);
    } else {
        res.status(204).end();
    }
};

/**
 * @api {get} /plugins Request Plugin List
 * @apiName GetPlugins
 * @apiGroup Plugin
 * 
 * @apiSuccess {Array} plugins       List of plugins.
 */
router.get('/', controller.all, after);
/**
 * @api {post} /plugins Create Plugin
 * @apiName CreatePlugin
 * @apiGroup Plugin
 */
router.post('/', controller.create, after);

// bukkitdev
router.get('/@bukkitdev/:id', bukkitController.show, after);
router.get('/@bukkitdev', bukkitController.all, after);

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
 * 
 */
router.get('/:id', controller.show, after);
router.put('/:id', controller.update, after);
router.delete('/:id', controller.delete, after);


module.exports = router;
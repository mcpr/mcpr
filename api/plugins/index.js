const express = require('express');
const router = express.Router();

const dbname = 'mc-registry';
const nano = require('nano')('https://db.filiosoft.com');
const db = nano.db.use(dbname);
const controller = require('./plugin.controller');

/**
 * GET /api/plugins
 */
/*router.get('/', function (req, res) {
    db.list({
        limit: 12
    }, function (err, body) {
        const list = [];
        if (err) {
            console.log(err);
        }
        var itemsProcessed = 0;
        body.rows.forEach((item, index, array) => {
            db.get(item.id, (err, body) => {
                if (err) {
                    console.log(err);
                }
                list.push(body);
                itemsProcessed++;
                if (itemsProcessed === array.length) {
                    send(list);
                }
            });
        });
    });

    function send(list) {
        res.json(list);
    }
});*/

var after = function (req, res) {
    if (req.plugin) {
        console.log(req.plugin)
        var plugin = req.plugin.toObject();
        res.json(plugin);
    }
    if (req.plugins) {
        console.log(req.plugins)
        var plugins = req.plugins;
        res.json(req.plugins);
    } else {
        res.status(204).end();
    }
}

router.get('/', controller.all, after);
router.post('/', controller.create, after);
router.get('/:id', controller.show, after);
router.put('/:id', controller.update, after);
router.delete('/:id', controller.delete, after);

module.exports = router
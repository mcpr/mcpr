const express = require('express');
const router = express.Router();
const pkg = require('../../../package.json');

const dbname = 'mc-registry';
const nano = require('nano')('https://db.filiosoft.com');
const db = nano.db.use(dbname);

/**
 * GET /api/v1/plugins
 */
router.get('/', function (req, res) {
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
});

module.exports = router
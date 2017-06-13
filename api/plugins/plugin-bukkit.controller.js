const bukkitApi = require('../../lib/bukkitApi')

exports.show = function (req, res, next) {
    bukkitApi.getPlugin(req.params.id)
        .then((res) => {
            if (!res) return res.status(404).end();
            jsonRes = JSON.parse(res);
            let plugin = {
                _id: req.params.id,
                short_description: jsonRes.shortdescription,
                title: jsonRes.title,
                author: jsonRes.authors,
                latest_version_date: jsonRes.lastrelease,
                readme: jsonRes.description,
                externalUrl: jsonRes.url,
                external: 'bukkitdev'
            }
            req.bukkitPlugin = plugin;
            next();
        })
        .catch((err) => {
            console.error(err)
            return handleError(res, err);
        });
}

exports.all = function (req, res, next) {
    bukkitApi.getAll()
        .then((res) => {
            jsonRes = JSON.parse(res);
            req.bukkitPlugin = plugin;
            next();
        })
        .catch((err) => {
            console.error(err)
            return handleError(res, err);
        });
}

function handleError(res, err) {
    console.log('ERROR: ' + err);
    if (err.statusCode = 404) {
        return res.status(404).send(err).end();
    }
    return res.status(500).send(err);
}
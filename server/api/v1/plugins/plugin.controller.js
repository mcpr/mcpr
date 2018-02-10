const mongoose = require('mongoose')
const Plugin = mongoose.model('Plugin')
const Version = mongoose.model('Version')
const path = require('path')
const request = require('request')
exports.model = Plugin

/**
 * @api {get} /plugins Request Plugin List
 * @apiName GetPlugins
 * @apiGroup Plugin
 *
 * @apiSuccess {Array} plugins       List of plugins.
 *
 * @apiParam  {string}  [sort]  Return plugins sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return plugins ordered by `downloads`, `_id`, `title`, `author`, `latest_version`, `latest_version_date`, or `created` fields. Default is `downloads`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/plugins
 */
exports.all = (req, res, next) => {
  const bukkitApi = require(req.config.rootPath + '/lib/bukkitApi')
  const convertModel = require(req.config.rootPath + '/lib/bukkitToMcpr')
  let perPage = Math.max(0, req.query.per_page) || 50
  let page = Math.max(0, req.query.page)
  let sort = req.query.sort || 'desc'
  let orderBy = req.query.order_by || 'downloads'
  let sortObj = {}
  sortObj[orderBy] = sort
  Plugin
    .find({})
    .limit(perPage)
    .skip(perPage * page)
    .sort(sortObj)
    .exec((err, plugins) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugins) {
        return handle404(res)
      }
      if (req.query.includeBukkitDev) {
        bukkitApi.getAll()
          .then(resp => {
            let jsonRes = JSON.parse(resp)
            return convertModel(jsonRes)
              .then(bukkitPlugins => {
                req.plugins = plugins.concat(bukkitPlugins)
                return next()
              })
              .catch(err => {
                return handleError(res, err)
              })
          })
          .catch(err => {
            return handleError(res, err)
          })
      } else {
        req.plugins = plugins
        next()
      }
    })
}

/**
 * @api {post} /plugins Create Plugin
 * @apiName CreatePlugin
 * @apiGroup Plugin
 *
 * @apiPermission authenticated
 * 
 * @apiParam  {String} _id       ID of plugin
 * @apiParam  {String} short_description       A short description of the plugin
 * @apiParam  {String} author       The author's user ID
 * @apiParam  {Date} created="CurrentTime"       The date on which the plugin was created
 * @apiParam  {String} title       The title of the plugin
 * @apiParam  {String} [source]       URL of the source code
 * @apiParam  {String} [readme]       The README.md file
 * @apiParam  {String} license       The license of the plugin
 * @apiParam  {Array} [keywords]       List of plugin keywords
 */
exports.create = (req, res, next) => {
  let plugin = req.body

  return Plugin
    .create(plugin, (err, plugin) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res)
      }
      req.plugin = plugin
      next()
    })
}

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
 *     curl -i https://mcpr.io/api/v1/plugins/dynmap
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "dynmap",
 *       "title": "Dynmap",
 *       "author": "mikeprimm",
 *       "short_description": "Dynamic \"Google Maps\" style web maps for your Spigot/Bukkit server",
 *       "latest_version": "2.4",
 *       "latest_version_date": "2017-02-11T00:00:00.000Z",
 *       "source": "webbukkit/dynmap",
 *       "sourceGithub": true,
 *       "readme": "## Dynamp Readme",
 *       "license": "MIT",
 *       "__v": 0,
 *       "keywords": ["map", "dynamic"],
 *       "flavors": ["bukkit", "spigot"],
 *       "created": "2017-06-12T22:55:07.759Z"
 *     }
 */
exports.show = (req, res, next) => {
  Plugin
    .findById(req.params.id)
    .exec((err, plugin) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res, req.params.id)
      }
      req.plugin = plugin
      next()
    })
}

/**
 * @api {get} /plugins/:id/download Download Plugin
 * @apiName DownloadPlugin
 * @apiGroup Plugin
 * @apiParam {String} id ID of plugin
 *
 * @apiExample {curl} Example usage:
 *     curl -i -o dynmap.jar https://mcpr.io/api/v1/plugins/dynmap/download
 */
exports.download = (req, res, next) => {
  const config = req.config
  Plugin
    .findById(req.params.id)
    .exec((err, plugin) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res, req.params.id)
      }
      let id = req.params.id
      let versionID = `${id}-${plugin.latest_version}`
      Version
        .findById(versionID)
        .exec((err, version) => {
          if (err) {
            return handleError(res, err)
          }
          if (!version) {
            return handle404(res, plugin.latest_version)
          }
          let file = `https://s3.amazonaws.com/${config.s3Bucket}/${id}/${plugin.latest_version}/${id}.jar`
          let filename = path.basename(`${id}-${plugin.latest_version}.jar`)

          plugin.downloads += 1
          plugin.save((err, response) => {
            if (err) {
              return handleError(res, err)
            }

            version.downloads += 1
            version.save((err, response) => {
              if (err) {
                return handleError(res, err)
              }
              res.setHeader('content-disposition', `attachment; filename=${filename}`)
              request(file).pipe(res)
            })
          })
        })
    })
}

/**
 * @api {put} /plugins/:id Update Plugin
 * @apiName UpdatePlugin
 * @apiGroup Plugin
 *
 * @apiPermission authenticated
 * 
 * @apiParam {String} id ID of plugin
 */
exports.update = (req, res) => {
  var updatedPlugin = req.body
  updatedPlugin.updated = Date.now()

  Plugin
    .findById(req.params.id)
    .exec((err, plugin) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res)
      }
      if (req.payload.username !== plugin.author) {
        return res.status(403).json({
          name: 'Forbidden',
          statusCode: 403,
          message: 'This plugin does not belong to you'
        })
      }

      Plugin
        .update({
          '_id': req.params.id
        }, updatedPlugin)
        .exec(() => {
          return res.status(200).json(updatedPlugin).end()
        })
    })
}

/**
 * @api {delete} /plugins/:id Delete Plugin
 * @apiName DeletePlugin
 * @apiGroup Plugin
 * @apiParam {String} id ID of plugin
 *
 * @apiPermission authenticated
 * 
 * @apiExample {curl} Example usage:
 *     curl -X "DELETE" https://mcpr.io/api/v1/plugins/dynmap
 */
exports.delete = (req, res, next) => {
  let pluginId = req.params.id
  Plugin
    .findById(pluginId)
    .exec((err, plugin) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res)
      }
      if (req.payload.username !== plugin.author) {
        return res.status(403).json({
          name: 'Forbidden',
          statusCode: 403,
          message: 'This plugin does not belong to you'
        })
      }

      Plugin
        .remove({
          '_id': pluginId
        })
        .exec((err, num) => {
          if (err) {
            return handleError(res, err)
          }
          if (num === 0) {
            return res.status(498).end()
          }
          next()
        })
    })
}

/**
 * @api {get} /users/:username/plugins Get User's Plugins
 * @apiName GetUsersPlugins
 * @apiGroup Plugin
 *
 * @apiSuccess {Array} plugins       List of plugins.
 *
 * @apiParam  {string}  username  Username to get owned plugins
 * @apiParam  {string}  [sort]  Return plugins sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return plugins ordered by `downloads`, `_id`, `title`, `author`, `latest_version`, `latest_version_date`, or `created` fields. Default is `downloads`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/users/nprail/plugins
 */
module.exports.showByUser = (req, res) => {
  let perPage = Math.max(0, req.query.per_page) || 50
  let page = Math.max(0, req.query.page)
  let sort = req.query.sort || 'desc'
  let orderBy = req.query.order_by || 'downloads'
  let sortObj = {}
  sortObj[orderBy] = sort

  Plugin
    .find({
      author: req.params.username
    })
    .limit(perPage)
    .skip(perPage * page)
    .sort(sortObj)
    .exec((err, plugins) => {
      if (err) {
        return handleError(res, err)
      }
      if (!plugins) {
        return handle404(res)
      }
      return res.status(200).json(plugins)
    })
}

/**
 * @api {get} /plugins/search Search For Plugins
 * @apiName SearchPlugins
 * @apiGroup Plugin
 *
 * @apiParam  {String} q  Keyword to search for
 * @apiExample {curl} Example usage:
 *     curl -X "GET" https://mcpr.io/api/v1/plugins/search?q=dynmap
 */
module.exports.search = (req, res) => {
  var query = {}
  query.title = new RegExp(req.query.q, 'i')

  let pluginQuery = Plugin.find(query)
  pluginQuery.select('_id short_description')

  pluginQuery.exec((err, results) => {
    if (err) {
      handleError(res, err)
    }
    let out = {}
    for (var i in results) {
      var id = results[i]._id
      out[id] = null
    }
    return res.status(200).send(results)
  })
}

const handleError = (res, err, code) => {
  console.log('ERROR: ' + err)
  let sCode = code || 500
  return res
    .status(sCode)
    .json({
      success: false,
      message: err
    })
}

const handle404 = (res) => {
  res.status(404)
  res.json({
    name: 'NotFound',
    statusCode: 404,
    message: '404: the resource that you requested could not be found'
  })
}

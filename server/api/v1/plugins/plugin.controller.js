const mongoose = require('mongoose')
const path = require('path')
const axios = require('axios')

const bukkitApi = require('../../../lib/bukkitApi')
const convertModel = require('../../../lib/bukkitToMcpr')

const Plugin = mongoose.model('Plugin')
const Version = mongoose.model('Version')

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
exports.all = async (req, res, next) => {
  try {
    const perPage = Math.max(0, req.query.per_page) || 50
    const page = Math.max(0, req.query.page)
    const sort = req.query.sort || 'desc'
    const orderBy = req.query.order_by || 'downloads'
    let sortObj = {}
    sortObj[orderBy] = sort

    let plugins = []

    const normalPlugins = await Plugin.find({})
      .limit(perPage)
      .skip(perPage * page)
      .sort(sortObj)

    if (!normalPlugins) {
      return handle404()
    }

    plugins = normalPlugins

    if (req.query.includeBukkitDev) {
      const resp = await bukkitApi.getAll()

      const bukkitPlugins = await convertModel(resp)
      plugins = plugins.concat(bukkitPlugins)
    }

    return res.status(200).json(plugins)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {post} /plugins Create Plugin
 * @apiName CreatePlugin
 * @apiGroup Plugin
 *
 * @apiPermission authenticated
 *
 * @apiParam  {String} short_description       A short description of the plugin
 * @apiParam  {String} author       The author's user ID
 * @apiParam  {Date} created="CurrentTime"       The date on which the plugin was created
 * @apiParam  {String} title       The title of the plugin
 * @apiParam  {String} [source]       URL of the source code
 * @apiParam  {String} [readme]       The README.md file
 * @apiParam  {String} license       The license of the plugin
 * @apiParam  {Array} [keywords]       List of plugin keywords
 */
exports.create = async (req, res, next) => {
  try {
    const plugin = new Plugin(req.body)

    await plugin.save()

    return res.status(201).json(plugin)
  } catch (err) {
    return next(err)
  }
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
exports.show = async (req, res, next) => {
  try {
    const { id } = req.params
    const plugin = await Plugin.findById(id)

    if (!plugin) {
      return handle404()
    }

    return res.status(200).json(plugin)
  } catch (err) {
    return next(err)
  }
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
exports.download = async (req, res, next) => {
  try {
    const { config } = req
    const { id } = req.params

    // get the plugin
    const plugin = await Plugin.findById(id)
    if (!plugin) {
      return handle404()
    }

    // get the version
    const versionId = `${id}-${plugin.latest_version}`
    const version = await Version.findById(versionId)
    if (!version) {
      return handle404()
    }

    const file = `https://s3.amazonaws.com/${config.s3Bucket}/${id}/${
      plugin.latest_version
    }/${id}.jar`
    const filename = path.basename(`${id}-${plugin.latest_version}.jar`)

    plugin.downloads += 1
    await plugin.save()

    version.downloads += 1
    await version.save()

    res.setHeader('content-disposition', `attachment; filename=${filename}`)
    const download = await axios.get(file, {
      responseType: 'stream'
    })
    download.data.on('end', () => res.end())
    download.data.pipe(res)
  } catch (err) {
    return next(err)
  }
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
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params
    const newPlugin = req.body
    newPlugin.updated = Date.now()

    const plugin = await Plugin.findById(id)

    if (!plugin) {
      return handle404()
    }

    if (req.payload.username !== plugin.author) {
      return res.status(403).json({
        name: 'Forbidden',
        statusCode: 403,
        message: 'This plugin does not belong to you'
      })
    }

    const updatedPlugin = await Plugin.update(
      {
        _id: id
      },
      newPlugin
    )

    return res.status(200).json(updatedPlugin)
  } catch (err) {
    return next(err)
  }
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
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params
    const plugin = await Plugin.findById(id)

    if (!plugin) {
      return handle404()
    }

    if (req.payload.username !== plugin.author) {
      return res.status(403).json({
        name: 'Forbidden',
        statusCode: 403,
        message: 'This plugin does not belong to you'
      })
    }

    await plugin.remove()

    return res.status(498).end()
  } catch (err) {
    return next(err)
  }
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
module.exports.showByUser = async (req, res, next) => {
  try {
    const perPage = Math.max(0, req.query.per_page) || 50
    const page = Math.max(0, req.query.page)
    const sort = req.query.sort || 'desc'
    const orderBy = req.query.order_by || 'downloads'
    let sortObj = {}
    sortObj[orderBy] = sort

    const plugins = await Plugin.find({
      author: req.params.username
    })
      .limit(perPage)
      .skip(perPage * page)
      .sort(sortObj)

    return res.status(200).json(plugins)
  } catch (err) {
    return next(err)
  }
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
module.exports.search = async (req, res, next) => {
  try {
    const query = {}
    query.title = new RegExp(req.query.q, 'i')

    const results = await Plugin.find(query).select('_id short_description')

    return res.status(200).send(results)
  } catch (err) {
    return next(err)
  }
}

const handle404 = () => {
  const err = new Error(
    '404: the resource that you requested could not be found'
  )
  err.name = 'NotFound'
  err.statusCode = 404

  throw err
}

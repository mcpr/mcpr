const createError = require('http-errors')

const bukkitApi = require('../../../lib/bukkitApi')
const convertModel = require('../../../lib/bukkitToMcpr')

const { PluginModel } = require('./plugin.model')
const { VersionModel } = require('../versions/versions.model')

const { paginateQuery } = require('../../../lib/paginate-query')

/**
 * @api {get} /plugins Request Plugin List
 * @apiName GetPlugins
 * @apiGroup Plugin
 *
 * @apiSuccess {Array} plugins       List of plugins.
 *
 * @apiParam  {string}  [sort]      Return plugins sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return plugins ordered by `downloads`, `slug`, `name`, `author`, or `created_at` fields. Default is `downloads`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/plugins
 */
exports.all = async (req, res, next) => {
  try {
    const normalPlugins = await paginateQuery(
      PluginModel,
      {
        perPage: req.query.per_page,
        page: req.query.page,
        sortDirection: req.query.sort || 'desc',
        orderBy: req.query.order_by || 'downloads'
      },
      {}
    )

    let plugins = []
    plugins = normalPlugins

    if (req.query.includeBukkitDev) {
      try {
        const resp = await bukkitApi.getAll()

        const bukkitPlugins = await convertModel(resp)
        plugins = plugins.concat(bukkitPlugins)
      } catch (err) {
        console.log('Failed to get Bukkit plugins...')
      }
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
    const pluginPayload = req.body

    delete pluginPayload.downloads

    const plugin = new PluginModel(pluginPayload)

    await plugin.save()

    return res.status(201).json(plugin)
  } catch (err) {
    if (err.code === 11000) {
      return next(createError(409, 'There is already a plugin with this name.'))
    }
    return next(err)
  }
}

/**
 * @api {get} /plugins/:id Get Plugin
 * @apiName GetPlugin
 * @apiGroup Plugin
 * @apiParam {String} id ID of plugin
 *
 * @apiSuccess {String} _id               ID of plugin
 * @apiSuccess {String} slug              Unique slug of plugin
 * @apiSuccess {String} description       A short description of the plugin
 * @apiSuccess {String} author            The author's user ID
 * @apiSuccess {String} name              The name of the plugin
 * @apiSuccess {Object} repository        URL of the source code
 * @apiSuccess {String} repository.url    URL of the source code
 * @apiSuccess {String} repository.type   Specifies whether or not the plugin source is hosted on GitHub
 * @apiSuccess {Array} flavors            List of supported Minecraft flavors
 * @apiSuccess {String} readme            The README.md file
 * @apiSuccess {String} license           The license of the plugin
 * @apiSuccess {Array} keywords           List of plugin keywords
 * @apiSuccess {Date} created_at          The date on which the plugin was created
 * @apiSuccess {Date} updated_at          The date on which the plugin was last updated
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/plugins/dynmap
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5e85081df5c24f350095ec25",
 *       "slug": "dynmap",
 *       "name": "Dynmap",
 *       "author": "mikeprimm",
 *       "description": "Dynamic \"Google Maps\" style web maps for your Spigot/Bukkit server",
 *       "repository": {
 *         "url": "webbukkit/dynmap",
 *         "type": "gh"
 *       },
 *       "readme": "## Dynamp Readme",
 *       "license": "MIT",
 *       "keywords": ["map", "dynamic"],
 *       "flavors": ["bukkit", "spigot"],
 *       "created_at": "2017-06-12T22:55:07.759Z",
 *       "updated_at": "2017-06-12T22:55:07.759Z"
 *     }
 */
exports.show = async (req, res, next) => {
  try {
    const { id } = req.params
    const plugin = await PluginModel.findOne({ slug: id })

    if (!plugin) {
      return next(createError(404))
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
    const plugin = await PluginModel.findOne({ slug: id })
    if (!plugin) {
      return next(createError(404))
    }

    // get the version
    const versionId = `${id}-${plugin.latest_version}`
    const version = await VersionModel.findById(versionId)
    if (!version) {
      return next(createError(404))
    }

    const file = `https://s3.amazonaws.com/${config.s3Bucket}/${id}/${plugin.latest_version}/${id}.jar`

    plugin.downloads += 1
    await plugin.save()

    version.downloads += 1
    await version.save()

    return res.redirect(302, file)
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
    if (!id || !newPlugin) {
      return next(createError(400, 'Please specify an ID and body.'))
    }

    delete newPlugin.downloads
    delete newPlugin.created_at
    delete newPlugin.updated_at

    const plugin = await PluginModel.findById(id)

    if (!plugin) {
      return next(createError(404))
    }

    if (req.payload.id !== plugin.author_id.toString()) {
      return next(createError(403, 'This plugin does not belong to you.'))
    }

    const updatedPlugin = await PluginModel.update(
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

    const plugin = await PluginModel.findOne({
      slug: id
    })

    if (!plugin) {
      return next(createError(404))
    }

    if (req.payload.id !== plugin.author_id.toString()) {
      return next(createError(403, 'This plugin does not belong to you.'))
    }

    await plugin.remove()

    return res.status(204).end()
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
    const sortObj = {}
    sortObj[orderBy] = sort

    const plugins = await PluginModel.find({
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
    query.name = new RegExp(req.query.q, 'i')

    const results = await PluginModel.find(query).select('_id slug description')

    return res.status(200).json(results)
  } catch (err) {
    return next(err)
  }
}

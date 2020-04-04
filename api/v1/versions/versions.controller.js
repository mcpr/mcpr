const createError = require('http-errors')

const { PluginModel } = require('../plugins/plugin.model')
const { VersionModel } = require('./versions.model')
const { paginateQuery } = require('../../../lib/paginate-query')

/**
 * @api {get} /versions Get Versions List
 * @apiName GetVersions
 * @apiGroup Versions
 *
 * @apiSuccess {Array} versions       List of versions.
 *
 * @apiParam  {string}  [sort]  Return versions sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return versions ordered by `downloads`, `version`, `plugin`, `size`, or `created` fields. Default is `downloads`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/verions
 */
exports.getVersions = async (req, res, next) => {
  try {
    const versions = await paginateQuery(
      VersionModel,
      {
        perPage: req.query.per_page,
        page: req.query.page,
        sortDirection: req.query.sort || 'desc',
        orderBy: req.query.order_by || 'downloads'
      },
      {}
    )

    return res.status(200).json(versions)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {post} /versions Create Version
 * @apiName CreateVersion
 * @apiGroup Versions
 *
 * @apiPermission authenticated
 *
 * @apiParam {String} plugin_id       ID of the plugin this version belongs to
 * @apiParam {String} version         SemVer string of the version
 * @apiParam  {String} release_notes  A short description of the changes in this version
 * @apiParam  {String} type           Type of the version. (Valid values are R, RC, B, and A)
 * @apiParam  {Array} game_versions   List of supported Minecraft versions
 */
exports.createVersion = async (req, res, next) => {
  const versionData = req.body
  try {
    const plugin = await PluginModel.findById(versionData.plugin_id)

    if (!plugin) {
      return next(createError(404))
    }

    if (req.payload.id !== plugin.author_id.toString()) {
      return next(createError(403, 'This plugin does not belong to you.'))
    }

    const existingPluginVersion = await VersionModel.find({
      plugin_id: plugin._id,
      version: versionData.version
    })

    if (existingPluginVersion.length > 0) {
      return next(
        createError(
          409,
          `Version ${versionData.version} already exists for ${plugin.slug}`
        )
      )
    }

    delete versionData.downloads
    delete versionData.size
    const version = await VersionModel.create(versionData)

    await plugin.save()

    return res.status(201).json(version)
  } catch (err) {
    // cast errors
    if (err.name === 'CastError') {
      return next(createError(400, err.message))
    }

    // validation errors
    if (err && err.errors) {
      if (err.errors.version) {
        return next(createError(400, err.errors.version.message))
      } else if (err.errors.type) {
        return next(createError(400, err.errors.type.message))
      } else {
        return next(createError(400, err))
      }
    }

    // other errors
    return next(err)
  }
}

/**
 * @api {get} /versions/:pluginId/:versionId Get Version
 * @apiName GetVersion
 * @apiGroup Versions
 * @apiParam {String} pluginId    Slug of the plugin
 * @apiParam {String} versionId   SemVer string of the version
 *
 * @apiSuccess {String} _id             ID of the version
 * @apiSuccess {String} plugin_id       ID of the plugin that the version is for
 * @apiSuccess {String} version         SemVer string of the version
 * @apiSuccess {String} release_notes   A short description of the changes in this version
 * @apiSuccess {Integer} downloads      Number of downloads this version has
 * @apiSuccess {Integer} size           Size of the plugin in bytes
 * @apiSuccess {Date} created           The date on which the plugin was created
 * @apiSuccess {String} type            Type of the version. (R for Release, RC for Release Candidate, B for Beta, and A for Alpha)
 * @apiSuccess {Array} game_versions    List of plugin keywords
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/versions/dynmap/2.4.0
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "5e85e29f5498b73d90d3fa0a",
 *       "plugin_id": "5e850f27722a123825c98f29",
 *       "version": "2.4.0",
 *       "release_notes": "Just some changes",
 *       "downloads": 10543,
 *       "size": 46547,
 *       "type": "R",
 *       "game_versions": ["1.8", "1.9", "1.10", "1.11"],
 *       "created_at": "2017-06-12T22:55:07.759Z",
 *       "updated_at": "2017-06-12T22:55:07.759Z"
 *     }
 */
exports.getVersion = async (req, res, next) => {
  try {
    const { pluginId, versionId } = req.params

    const plugin = await PluginModel.findOne({ slug: pluginId })

    if (!plugin) {
      return next(createError(404))
    }

    const version = await VersionModel.findOne({
      plugin_id: plugin._id,
      version: versionId
    })

    if (!version) {
      return next(createError(404))
    }

    return res.status(200).json(version)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /versions/:pluginId/:versionId/download Download Plugin
 * @apiName DownloadVersion
 * @apiGroup Versions
 * @apiParam {String} pluginId ID of plugin
 * @apiParam {String} versionId Version of plugin
 *
 * @apiExample {curl} Example usage:
 *     curl -i -o dynmap.jar https://mcpr.io/api/v1/versions/dynmap/2.4.0/download
 */
exports.download = async (req, res, next) => {
  try {
    const { config } = req
    const { pluginId, versionId } = req.params

    const plugin = await PluginModel.findOne({ slug: pluginId })

    if (!plugin) {
      return next(createError(404))
    }

    const version = await VersionModel.findOne({
      plugin_id: plugin._id,
      version: versionId
    })

    if (!version) {
      return next(createError(404))
    }

    const file = `https://s3.amazonaws.com/${config.s3Bucket}/${pluginId}/${versionId}/${pluginId}.jar`

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
 * @api {put} /versions/:pluginId/:versionId Update Version
 * @apiName UpdateVersion
 * @apiGroup Versions
 *
 * @apiPermission authenticated
 *
 * @apiParam {String} pluginId ID of plugin
 * @apiParam {String} versionId Version of plugin
 */
exports.updateVersion = async (req, res, next) => {
  try {
    const { pluginId, versionId } = req.params
    const version = req.body

    const plugin = await PluginModel.findOne({ slug: pluginId })

    if (!plugin) {
      return next(createError(404))
    }

    if (req.payload.id !== plugin.author_id.toString()) {
      return next(createError(403, 'This plugin does not belong to you.'))
    }

    const updatedVersion = await VersionModel.update(
      {
        version: versionId,
        plugin_id: plugin._id
      },
      {
        release_notes: version.release_notes,
        game_versions: version.game_versions
      },
      {
        new: true
      }
    )

    if (!updatedVersion) {
      return next(createError(404))
    }

    return res.status(200).json(updatedVersion)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {delete} /versions/:pluginId/:versionId Delete Version
 * @apiName DeleteVersion
 * @apiGroup Versions
 * @apiParam {String} pluginId ID of plugin
 * @apiParam {String} versionId Version of plugin
 *
 * @apiPermission authenticated
 *
 * @apiExample {curl} Example usage:
 *     curl -X "DELETE" https://mcpr.io/api/v1/versions/dynmap/2.4.0
 */
exports.deleteVersion = async (req, res, next) => {
  try {
    const { pluginId, versionId } = req.params

    const plugin = await PluginModel.findOne({ slug: pluginId })

    if (!plugin) {
      return next(createError(404))
    }

    if (req.payload.id !== plugin.author_id.toString()) {
      return next(createError(403, 'This plugin does not belong to you.'))
    }

    const changed = await VersionModel.remove({
      version: versionId,
      plugin_id: plugin._id
    })

    if (changed === 0) {
      return next(createError(404))
    }

    return res.status(204).end()
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /versions/:pluginId Get Plugin's Verions
 * @apiName GetPluginVersions
 * @apiGroup Versions
 *
 * @apiSuccess {Array} versions       List of versions.
 *
 * @apiParam  {string}  [sort]  Return versions sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return versions ordered by `downloads`, `version`, `plugin`, `size`, or `created_at` fields. Default is `version`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/versions/dynmap
 */
module.exports.showByPlugin = async (req, res, next) => {
  try {
    const plugin = await PluginModel.findOne({ slug: req.params.pluginId })

    if (!plugin) {
      return next(createError(404))
    }

    const versions = await paginateQuery(
      VersionModel,
      {
        perPage: req.query.per_page,
        page: req.query.page,
        sortDirection: req.query.sort || 'desc',
        orderBy: req.query.order_by || 'version'
      },
      { plugin_id: plugin._id }
    )

    return res.status(200).json(versions)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {post} /versions/:pluginId/:versionId/upload Upload Plugin Jar
 * @apiName UploadVersion
 * @apiGroup Versions
 *
 * @apiPermission authenticated
 *
 * @apiParam  {String} pluginId     ID of the plugin
 * @apiParam  {String} versionId    Version number of the plugin
 * @apiParam  {String} jar          Plugin jar file `multipart/form-data`
 */
exports.upload = async (req, res, next) => {
  try {
    const { versionId, pluginId } = req.params

    if (req.filterError) {
      return next(createError(415, req.filterError))
    }

    const plugin = await PluginModel.findOne({ slug: pluginId })

    if (!plugin) {
      return next(createError(404))
    }

    if (req.payload.id !== plugin.author_id.toString()) {
      return next(createError(403, 'This plugin does not belong to you.'))
    }

    const version = await VersionModel.findOne({
      version: versionId,
      plugin_id: plugin._id
    })

    if (!version) {
      return next(createError(404))
    }

    const file = req.file

    version.size = file.size

    await version.save()

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully!',
      file,
      result: file.location
    })
  } catch (err) {
    return next(err)
  }
}

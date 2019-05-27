const mongoose = require('mongoose')
const path = require('path')
const axios = require('axios')

const Plugin = mongoose.model('Plugin')
const Version = mongoose.model('Version')

exports.model = Version

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
exports.all = async (req, res, next) => {
  try {
    const perPage = Math.max(0, req.query.per_page) || 50
    const page = Math.max(0, req.query.page)
    const sort = req.query.sort || 'desc'
    const orderBy = req.query.order_by || 'downloads'
    let sortObj = {}
    sortObj[orderBy] = sort

    const versions = await Version.find({})
      .limit(perPage)
      .skip(perPage * page)
      .sort(sortObj)

    if (!versions) {
      return handle404()
    }

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
 * @apiParam {String} plugin          ID of the plugin this version belongs to
 * @apiParam {String} version         SemVer string of the version
 * @apiParam  {String} release_notes  A short description of the changes in this version
 * @apiParam  {String} type           Type of the version. (Valid values are R, RC, B, and A)
 * @apiParam  {Array} game_versions   List of supported Minecraft versions
 */
exports.create = async (req, res, next) => {
  try {
    const versionData = req.body
    versionData._id = `${versionData.plugin}-${versionData.version}`

    const plugin = await Plugin.findById(versionData.plugin)

    if (!plugin) {
      return handle404()
    }

    const version = await Version.create(versionData)

    plugin.latest_version = version.version
    plugin.latest_version_date = Date.now()

    await plugin.save()
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /versions/:pluginID/:versionID Get Version
 * @apiName GetVersion
 * @apiGroup Versions
 * @apiParam {String} pluginID ID of plugin
 * @apiParam {String} versionID SemVer string of the version
 *
 * @apiSuccess {String} _id       ID of the version
 * @apiSuccess {String} version       SemVer string of the version
 * @apiSuccess {String} release_notes       A short description of the changes in this version
 * @apiSuccess {Integer} downloads       Number of downloads this version has
 * @apiSuccess {String} size       Size of the plugin in bytes
 * @apiSuccess {Date} created       The date on which the plugin was created
 * @apiSuccess {String} type           Type of the version. (R for Release, RC for Release Candidate, B for Beta, and A for Alpha)
 * @apiSuccess {Array} game_versions       List of plugin keywords
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/versions/dynmap/2.4.0
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "dynmap-2.4.0",
 *       "version": "2.4.0",
 *       "release_notes": "Just some changes",
 *       "downloads": 10543,
 *       "size": "46547",
 *       "type": "R",
 *       "game_versions": ["1.8", "1.9", "1.10", "1.11"],
 *       "created": "2017-06-12T22:55:07.759Z"
 *     }
 */
exports.show = async (req, res, next) => {
  try {
    const { pluginID, versionID } = req.params
    const id = `${pluginID}-${versionID}`

    const version = await Version.findById(id)

    if (!version) {
      return handle404()
    }

    return res.status(200).json(version)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /versions/:pluginID/:versionID/download Download Plugin
 * @apiName DownloadVersion
 * @apiGroup Versions
 * @apiParam {String} pluginID ID of plugin
 * @apiParam {String} versionID Version of plugin
 *
 * @apiExample {curl} Example usage:
 *     curl -i -o dynmap.jar https://mcpr.io/api/v1/versions/dynmap/2.4.0/download
 */
exports.download = async (req, res, next) => {
  try {
    const { pluginID, versionID } = req.params
    const id = `${pluginID}-${versionID}`
    const config = req.config

    const plugin = await Plugin.findById(pluginID)

    if (!plugin) {
      return handle404()
    }

    const version = await Version.findById(id)

    if (!version) {
      return handle404()
    }

    const bucket = `https://s3.amazonaws.com/${config.s3Bucket}`
    const filename = path.basename(`${pluginID}-${versionID}.jar`)
    const file = `${bucket}/${pluginID}/${versionID}/${pluginID}.jar`

    plugin.downloads += 1
    await plugin.save()

    version.downloads += 1
    await version.save()

    res.setHeader('content-disposition', `attachment; filename=${filename}`)

    const download = await axios.get(file, {
      responseType: 'stream'
    })

    download.data.pipe(res)
    download.data.on('end', () => res.end())
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {put} /versions/:pluginID/:versionID Update Version
 * @apiName UpdateVersion
 * @apiGroup Versions
 *
 * @apiPermission authenticated
 *
 * @apiParam {String} pluginID ID of plugin
 * @apiParam {String} versionID Version of plugin
 */
exports.update = async (req, res, next) => {
  try {
    const { pluginID, versionID } = req.params
    const id = `${pluginID}-${versionID}`

    const version = req.body
    version.updated = Date.now()

    const updatedVersion = await Version.update(
      {
        _id: id
      },
      version,
      {
        new: true
      }
    )

    if (!updatedVersion) {
      return handle404()
    }

    return res.status(200).json(updatedVersion)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {delete} /versions/:pluginID/:versionID Delete Version
 * @apiName DeleteVersion
 * @apiGroup Versions
 * @apiParam {String} pluginID ID of plugin
 * @apiParam {String} versionID Version of plugin
 *
 * @apiPermission authenticated
 *
 * @apiExample {curl} Example usage:
 *     curl -X "DELETE" https://mcpr.io/api/v1/versions/dynmap/2.4.0
 */
exports.delete = async (req, res, next) => {
  try {
    const { pluginID, versionID } = req.params
    const id = `${pluginID}-${versionID}`

    const changed = await Version.remove({
      _id: id
    })

    if (changed === 0) {
      return handle404()
    }

    return res.status(204).end()
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {get} /versions/:pluginID Get Plugin's Verions
 * @apiName GetPluginVersions
 * @apiGroup Versions
 *
 * @apiSuccess {Array} versions       List of versions.
 *
 * @apiParam  {string}  [sort]  Return versions sorted in `asc` or `desc` order. Default is `desc`
 * @apiParam  {string}  [order_by]  Return versions ordered by `downloads`, `version`, `plugin`, `size`, or `created` fields. Default is `downloads`
 *
 * @apiExample {curl} Example usage:
 *     curl -i https://mcpr.io/api/v1/versions/dynmap
 */
module.exports.showByPlugin = async (req, res, next) => {
  try {
    const perPage = Math.max(0, req.query.per_page) || 50
    const page = Math.max(0, req.query.page)
    const sort = req.query.sort || 'desc'
    const orderBy = req.query.order_by || 'downloads'
    let sortObj = {}
    sortObj[orderBy] = sort

    const versions = await Version.find({
      plugin: req.params.pluginID
    })
      .limit(perPage)
      .skip(perPage * page)
      .sort(sortObj)

    if (!versions) {
      return handle404()
    }

    return res.status(200).json(versions)
  } catch (err) {
    return next(err)
  }
}

/**
 * @api {post} /versions/:pluginID/:versionID/upload Upload Plugin Jar
 * @apiName UploadVersion
 * @apiGroup Versions
 *
 * @apiPermission authenticated
 *
 * @apiParam  {String} id       ID of the plugin
 * @apiParam  {String} version  Version number of the plugin
 * @apiParam  {String} jar      Plugin jar file `multipart/form-data`
 */
exports.upload = async (req, res, next) => {
  try {
    const { versionID, pluginID } = req.params
    const id = `${pluginID}-${versionID}`

    if (req.filterError) {
      return next(new Error(req.filterError))
    }

    const version = await Version.findById(id)

    if (!version) {
      return handle404()
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

const handle404 = () => {
  const err = new Error(
    '404: the resource that you requested could not be found'
  )
  err.name = 'NotFound'
  err.statusCode = 404

  throw err
}

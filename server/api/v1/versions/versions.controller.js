const mongoose = require('mongoose')
const Plugin = mongoose.model('Plugin')
const Version = mongoose.model('Version')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new aws.S3()
const path = require('path')
const request = require('request')

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
exports.all = function (req, res, next) {
  let perPage = Math.max(0, req.query.per_page) || 50
  let page = Math.max(0, req.query.page)
  let sort = req.query.sort || 'desc'
  let orderBy = req.query.order_by || 'downloads'
  let sortObj = {}
  sortObj[orderBy] = sort

  Version
    .find({})
    .limit(perPage)
    .skip(perPage * page)
    .sort(sortObj)
    .exec(function (err, versions) {
      if (err) {
        return handleError(res, err)
      }
      if (!versions) {
        return handle404(res)
      }
      req.versions = versions
      next()
    })
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
exports.create = function (req, res, next) {
  let version = req.body
  version._id = `${version.plugin}-${version.version}`
  return Plugin.findById(version.plugin)
    .exec(function (err, plugin) {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res, {
          message: 'The plugin you tried to create a version for does not exist'
        })
      }

      return Version
        .create(version, function (err, version) {
          if (err) {
            return handleError(res, err)
          }
          if (!version) {
            return handle404(res)
          }
          plugin.latest_version = version.version
          plugin.latest_version_date = Date.now()
          plugin.save(function (err, response) {
            if (err) {
              return handleError(res, err)
            }
            req.version = version
            next()
          })
        })
    })
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
exports.show = function (req, res, next) {
  let id = `${req.params.pluginID}-${req.params.versionID}`
  Version
    .findById(id)
    .exec(function (err, version) {
      if (err) {
        return handleError(res, err)
      }
      if (!version) {
        return handle404(res, id)
      }
      req.version = version
      next()
    })
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
exports.download = function (req, res, next) {
  let id = `${req.params.pluginID}-${req.params.versionID}`
  const config = req.config

  return Plugin.findById(req.params.pluginID)
    .exec(function (err, plugin) {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res, {
          message: 'The plugin you tried to download a version from does not exist'
        })
      }

      Version
        .findById(id)
        .exec(function (err, version) {
          if (err) {
            return handleError(res, err)
          }
          if (!version) {
            return handle404(res, id)
          }
          let filename
          let file
          filename = path.basename(`${req.params.pluginID}-${req.params.versionID}.jar`)
          file = `https://s3.amazonaws.com/${config.s3Bucket}/${req.params.pluginID}/${req.params.versionID}/${req.params.pluginID}.jar`
          version.downloads += 1
          plugin.downloads += 1
          plugin.save(function (err, response) {
            if (err) {
              return handleError(res, err)
            }
            version.save(function (err, response) {
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
 * @api {put} /versions/:pluginID/:versionID Update Version
 * @apiName UpdateVersion
 * @apiGroup Versions
 *
 * @apiPermission authenticated
 * 
 * @apiParam {String} pluginID ID of plugin
 * @apiParam {String} versionID Version of plugin
 */
exports.update = function (req, res) {
  let id = `${req.params.pluginID}-${req.params.versionID}`
  var updatedVersion = req.body
  updatedVersion.updated = Date.now()

  Version
    .findById(id)
    .exec(function (err, plugin) {
      if (err) {
        return handleError(res, err)
      }
      if (!plugin) {
        return handle404(res)
      }
      Version
        .update({
          '_id': id
        }, updatedVersion)
        .exec(function () {
          return res.status(204).end()
        })
    })
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
exports.delete = function (req, res, next) {
  let id = `${req.params.pluginID}-${req.params.versionID}`
  Version
    .remove({
      '_id': id
    })
    .exec(function (err, num) {
      if (err) {
        return handleError(res, err)
      }
      if (num === 0) {
        return res.status(498).end()
      }
      next()
    })
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
module.exports.showByPlugin = function (req, res) {
  let perPage = Math.max(0, req.query.per_page) || 50
  let page = Math.max(0, req.query.page)
  let sort = req.query.sort || 'desc'
  let orderBy = req.query.order_by || 'downloads'
  let sortObj = {}
  sortObj[orderBy] = sort

  Version
    .find({
      plugin: req.params.pluginID
    })
    .limit(perPage)
    .skip(perPage * page)
    .sort(sortObj)
    .exec(function (err, versions) {
      if (err) {
        return handleError(res, err)
      }
      if (!versions) {
        return handle404(res)
      }
      return res.status(200).json(versions)
    })
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
exports.upload = function (req, res, next) {
  const config = req.config
  const version = req.params.versionID
  const pluginID = req.params.pluginID
  const bucket = config.s3Bucket
  const id = `${pluginID}-${version}`

  const uploader = multer({
    fileFilter: function (req, file, cb) {
      if (path.extname(file.originalname) !== '.jar') {
        req.filterError = 'Only jars are allowed'
        return cb(new Error('Only jars are allowed'))
      }

      cb(null, true)
    },
    storage: multerS3({
      s3: s3,
      bucket: bucket,
      metadata: function (req, file, cb) {
        cb(null, {
          fieldName: file.fieldname
        })
      },
      key: function (req, file, cb) {
        console.log(file)
        cb(null, `${pluginID}/${version}/${pluginID}.jar`)
      }
    })

  }).single('jar')

  Version
    .findById(id)
    .exec(function (err, version) {
      if (err) {
        return handleError(res, err)
      }
      if (!version) {
        return handle404(res, id)
      }

      uploader(req, res, function (err) {
        if (req.filterError) {
          return handleError(res, {
            success: false,
            message: req.filterError
          })
        }
        if (err) {
          return handleError(res, err)
        }
        const file = req.file

        version.size = file.size

        version.save(function (err, response) {
          if (err) {
            return handleError(res, err)
          }
          res.status(200).json({
            success: true,
            message: 'File uploaded successfully!',
            file: file,
            result: file.location
          })
        })
      })
    })
}

const handleError = function (res, err) {
  console.log('ERROR: ' + err)
  return res.status(500).send(err)
}

const handle404 = function (res, err) {
  res.status(404)
  if (err.message) {
    return res.json({
      name: 'NotFound',
      statusCode: 404,
      message: err.message
    })
  }
  res.json({
    name: 'NotFound',
    statusCode: 404,
    message: '404: the resource that you requested could not be found'
  })
}

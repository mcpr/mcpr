const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')

const config = require('../config/config')

const s3 = new aws.S3()
const bucket = `https://s3.amazonaws.com/${config.s3Bucket}`

const uploader = multer({
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.jar') {
      req.filterError = 'Only jars are allowed'
      return cb(new Error('Only jars are allowed'))
    }

    return cb(null, true)
  },
  storage: multerS3({
    s3,
    bucket,
    metadata: (req, file, cb) => {
      return cb(null, {
        fieldName: file.fieldname
      })
    },
    key: (req, file, cb) => {
      const { versionId, pluginId } = req.params
      cb(null, `${pluginId}/${versionId}/${pluginId}.jar`)
    }
  })
}).single('jar')

module.exports = uploader

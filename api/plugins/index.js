const express = require('express')
const router = express.Router()
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new aws.S3()
const path = require('path')

const controller = require('./plugin.controller')
const bukkitController = require('./plugin-bukkit.controller')

const after = function (req, res) {
  if (req.plugin) {
    let plugin = req.plugin.toObject()
    res.json(plugin)
  }
  if (req.bukkitPlugin) {
    let plugin = req.bukkitPlugin
    res.json(plugin)
  }
  if (req.plugins) {
    let plugins = req.plugins
    res.json(plugins)
  }
  if (req.bukkitPlugins) {
    res.json(req.bukkitPlugins)
  } else {
    res.status(204).end()
  }
}

const uploader = multer({
  fileFilter: function (req, file, cb) {
    console.log(file.originalname)
    if (path.extname(file.originalname) !== '.jar') {
      return cb(new Error('Only jars are allowed'))
    }

    cb(null, true)
  },
  storage: multerS3({
    s3: s3,
    bucket: 'download.mcpr.io',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      })
    },
    key: function (req, file, cb) {
      console.log(file)
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
})

router.get('/', controller.all, after)
router.post('/search', controller.search)
router.post('/', controller.create, after)
router.post('/upload', uploader.array('jar', 1), controller.upload, after)

// bukkitdev
router.get('/@bukkitdev/:id', bukkitController.show, after)
router.get('/@bukkitdev', bukkitController.all, after)

router.get('/:id', controller.show, after)
router.put('/:id', controller.update, after)
router.delete('/:id', controller.delete, after)

module.exports = router

const mongoose = require('mongoose')
const semver = require('semver')
const Schema = mongoose.Schema

module.exports = function (config) {
  const VersionSchema = new Schema({
    _id: {
      type: String,
      unique: true
    },
    version: String,
    plugin: String,
    release_notes: String,
    type: String,
    created: {
      type: Date,
      default: Date.now
    },
    downloads: {
      type: Number,
      default: 0
    },
    size: Number,
    game_versions: []
  })

  VersionSchema.pre('save', function (next) {
    let version = this

    if (!version.downloads) {
      version.downloads = 0
    }
    return next()
  })
  const model = mongoose.model('Version', VersionSchema)

  model.schema
    .path('release_notes')
    .required('You need to have release notes')
  model.schema
    .path('version')
    .required('You need to have a version string')
    .validate(function (value) {
      return semver.valid(value)
    }, 'Version must be a valid semver string!')
  model.schema
    .path('plugin')
    .required('This version must belong to a plugin')

  return model
}

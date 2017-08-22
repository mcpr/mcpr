const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VersionSchema = new Schema({
  _id: {
    type: String,
    unique: true
  },
  version: String,
  plugin: String,
  release_notes: String,
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

const model = mongoose.model('Version', VersionSchema)

model.schema
  .path('release_notes')
  .required('You need to have release notes')
model.schema
  .path('version')
  .required('You need to have a version string')
model.schema
  .path('plugin')
  .required('This version must belong to a plugin')

module.exports = model

const mongoose = require('mongoose')

module.exports = function (config) {
  const slugify = require(config.rootPath + '/lib/slug')
  const Schema = mongoose.Schema

  const PluginSchema = new Schema({
    _id: {
      type: String,
      unique: true
    },
    short_description: String,
    author: String,
    created: {
      type: Date,
      default: Date.now
    },
    title: String,
    latest_version_date: Date,
    latest_version: String,
    downloads: Number,
    source: String,
    readme: String,
    license: String,
    keywords: []
  })

  PluginSchema.pre('save', function (next) {
    let plugin = this
    plugin._id = slugify(plugin.title)
    if (!plugin.downloads) {
      plugin.downloads = 0
    }
    return next()
  })
  const model = mongoose.model('Plugin', PluginSchema)

  model.schema
    .path('title')
    .required('You need to give your plugin a title')
  model.schema
    .path('author')
    .required('You need to have an author')
  model.schema
    .path('license')
    .required('You need to have a license')
  model.schema
    .path('short_description')
    .required('You need to have a description')

  return model
}

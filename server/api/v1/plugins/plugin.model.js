const mongoose = require('mongoose')
const slugify = require('slugify')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const pluginSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'You need to give your plugin a name']
    },
    slug: {
      type: String,
      unique: true,
      default: function () {
        return this.slug || slugify(this.name, { lower: true })
      },
      required: true
    },
    description: String,
    author_id: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'You need to have an author']
    },
    downloads: {
      type: Number,
      default: 0
    },
    repository: {
      url: String
    },
    readme: String,
    license: {
      type: String,
      required: [true, 'You need to have a license']
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const PluginModel = mongoose.model('Plugin', pluginSchema)

module.exports = { PluginModel }

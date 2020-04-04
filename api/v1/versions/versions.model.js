const mongoose = require('mongoose')
const semver = require('semver')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const versionSchema = new Schema(
  {
    version: {
      type: String,
      required: [true, 'You need to have a version string'],
      validate: {
        validator: function (value) {
          return semver.valid(value)
        },
        message: props => `${props.value} is not a valid SemVer string!`
      }
    },
    plugin_id: {
      type: ObjectId,
      required: [true, 'This version must belong to a plugin'],
      ref: 'Plugin'
    },
    release_notes: {
      type: String,
      required: [true, 'You need to have release notes']
    },
    type: {
      type: String,
      enum: ['R', 'RC', 'B', 'A'],
      default: 'R'
    },
    downloads: {
      type: Number,
      default: 0
    },
    size: Number,
    game_versions: {
      type: [String],
      default: []
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

versionSchema.pre('save', function (next) {
  const version = this

  if (version.isModified('version') || version.isNew) {
    this.version = semver.clean(this.version)
  }
  return next()
})

const VersionModel = mongoose.model('Version', versionSchema)

module.exports = { VersionModel }

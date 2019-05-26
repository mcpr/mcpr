const slugify = require('./slug.js')
const bukkitApi = require('./bukkitApi')

const convertModel = async bukkitPlugins => {
  try {
    const processPlugins = bukkitPlugins.map(async bukkitPlugin => {
      const data = await Promise.all([
        bukkitApi.getPlugin(bukkitPlugin.slug),
        bukkitApi.getPluginFiles(bukkitPlugin.slug)
      ])
      const plugin = data[0]
      const files = data[1]

      const latestFiles = files[0]
      const keywords = []

      for (const cat of bukkitPlugin.categories) {
        keywords.push(slugify(cat.name))
      }

      const mcprPlugin = {
        _id: bukkitPlugin.slug,
        short_description: plugin.shortdescription,
        title: plugin.title,
        author: plugin.authors[0].name,
        latest_version_date: plugin.lastrelease,
        latest_version: latestFiles.name,
        latest_version_file: latestFiles,
        downloads: latestFiles.downloads,
        readme: plugin.description,
        keywords,
        externalUrl: plugin.url,
        external: true,
        namespace: '@bukkitdev'
      }

      return mcprPlugin
    })

    const plugins = await Promise.all(processPlugins)

    return plugins
  } catch (err) {
    throw err
  }
}

module.exports = convertModel

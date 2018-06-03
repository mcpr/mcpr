const slugify = require('./slug.js')
const bukkitApi = require('./bukkitApi')

function convertModel (bukkit) {
  return new Promise(function (resolve, reject) {
    let plugins = []
    let itemsProcessed = 0
    for (let i = 0; i < bukkit.length; i++) {
      ;(() => {
        let bukkitPlugin = bukkit[i]
        return bukkitApi
          .getPlugin(bukkitPlugin.slug)
          .then(res => {
            return bukkitApi
              .getPluginFiles(bukkitPlugin.slug)
              .then(files => {
                let latestFiles = files[0]
                let keywords = []
                for (let i = 0; i < bukkitPlugin.categories.length; i++) {
                  ;(() => {
                    let slug = slugify(bukkitPlugin.categories[i].name)
                    keywords.push(slug)
                  })()
                }
                let plugin = {
                  _id: bukkitPlugin.slug,
                  short_description: res.shortdescription,
                  title: res.title,
                  author: res.authors[0].name,
                  latest_version_date: res.lastrelease,
                  latest_version: latestFiles.name,
                  latest_version_file: latestFiles,
                  downloads: latestFiles.downloads,
                  readme: res.description,
                  keywords: keywords,
                  externalUrl: res.url,
                  external: true,
                  namespace: '@bukkitdev'
                }
                plugins.push(plugin)
                itemsProcessed++
                if (itemsProcessed === bukkit.length) {
                  return resolve(plugins)
                }
              })
              .catch(err => {
                reject(err)
              })
          })
          .catch(err => {
            reject(err)
          })
      })()
    }
  })
}

module.exports = convertModel

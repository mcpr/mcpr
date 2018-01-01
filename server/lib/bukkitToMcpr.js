const slugify = require('./slug.js')
const bukkitApi = require('./bukkitApi')

function convertModel (bukkit) {
  return new Promise(function (resolve, reject) {
    let plugins = []
    let itemsProcessed = 0
    for (let i = 0; i < bukkit.length; i++) {
      (() => {
        let bukkitPlugin = bukkit[i]
        return bukkitApi.getPlugin(bukkitPlugin.slug)
          .then(res => {
            let jsonRes = JSON.parse(res)
            return bukkitApi.getPluginFiles(bukkitPlugin.slug)
              .then(files => {
                let jsonFiles = JSON.parse(files)
                let latestFiles = jsonFiles[0]
                let keywords = []
                for (let i = 0; i < bukkitPlugin.categories.length; i++) {
                  (() => {
                    let slug = slugify(bukkitPlugin.categories[i].name)
                    keywords.push(slug)
                  })()
                }
                let plugin = {
                  _id: bukkitPlugin.slug,
                  short_description: jsonRes.shortdescription,
                  title: jsonRes.title,
                  author: jsonRes.authors[0].name,
                  latest_version_date: jsonRes.lastrelease,
                  latest_version: latestFiles.name,
                  latest_version_file: latestFiles,
                  downloads: latestFiles.downloads,
                  readme: jsonRes.description,
                  keywords: keywords,
                  externalUrl: jsonRes.url,
                  external: true,
                  namespace: '@bukkitdev'
                }
                plugins.push(plugin)
                itemsProcessed++
                if (itemsProcessed === bukkit.length) {
                  return resolve(plugins)
                }
              })
              .catch((err) => {
                reject(err)
              })
          })
          .catch((err) => {
            reject(err)
          })
      })()
    }
  })
}

module.exports = convertModel

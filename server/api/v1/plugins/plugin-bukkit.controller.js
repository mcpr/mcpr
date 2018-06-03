const path = require('path')
const axios = require('axios')

module.exports = function (config) {
  const bukkitApi = require(config.rootPath + '/lib/bukkitApi')
  const slugify = require(config.rootPath + '/lib/slug')
  const convertModel = require(config.rootPath + '/lib/bukkitToMcpr')

  const show = function (req, res, next) {
    bukkitApi
      .getPlugin(req.params.id)
      .then(resp => {
        return bukkitApi
          .getPluginFiles(req.params.id)
          .then(files => {
            let latestFiles = files[0]
            let keywords = []
            let lt = resp.categories.length
            for (var i = 0; i < lt; i++) {
              ;(function () {
                let slug = slugify(resp.categories[i].name)
                keywords.push(slug)
              })()
            }
            let plugin = {
              _id: req.params.id,
              short_description: resp.shortdescription,
              title: resp.title,
              author: resp.authors,
              latest_version_date: resp.lastrelease,
              latest_version: latestFiles.name,
              latest_version_file: latestFiles,
              readme: resp.description,
              keywords: keywords,
              externalUrl: resp.url,
              external: true,
              namespace: '@bukkitdev'
            }
            req.bukkitPlugin = plugin
            next()
          })
          .catch(err => {
            return handleError(res, err)
          })
      })
      .catch(err => {
        return handleError(res, err)
      })
  }

  const download = async (req, res) => {
    try {
      const plugin = await bukkitApi.getPlugin(req.params.id)
      const filename = path.basename(`${req.params.id}.jar`)

      res.setHeader('content-disposition', `attachment; filename=${filename}`)

      // request(plugin.download).pipe(res)
      const download = await axios.get(plugin.download, {
        responseType: 'stream'
      })

      // console.log(res.data)
      download.data.on('end', () => res.end())
      download.data.pipe(res)
    } catch (err) {
      return handleError(res, err)
    }
  }

  const showAll = function (req, res, next) {
    bukkitApi
      .getAll()
      .then(res => {
        convertModel(res)
          .then(plugins => {
            req.bukkitPlugins = plugins
            next()
          })
          .catch(err => {
            console.error(err)
            return handleError(res, err)
          })
      })
      .catch(err => {
        console.error(err)
        return handleError(res, err)
      })
  }

  const handleError = function (res, err) {
    if (err.statusCode === 404) {
      return res
        .status(404)
        .send({
          name: err.name,
          statusCode: err.statusCode,
          message: err.message
        })
        .end()
    }
    return res.status(500).send(err)
  }

  return {
    show: show,
    all: showAll,
    download
  }
}

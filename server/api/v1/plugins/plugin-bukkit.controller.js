const path = require('path')
const axios = require('axios')

const bukkitApi = require('../../../lib/bukkitApi')
const slugify = require('../../../lib/slug')
const convertModel = require('../../../lib/bukkitToMcpr')

module.exports = config => {
  const show = async (req, res, next) => {
    try {
      const { id } = req.params
      const resps = await Promise.all([
        bukkitApi.getPlugin(id),
        bukkitApi.getPluginFiles(id)
      ])
      const pluginInfo = resps[0]
      const files = resps[1]

      const latestFiles = files[0]
      const keywords = []

      for (const category of pluginInfo.categories) {
        const slug = slugify(category.name)
        keywords.push(slug)
      }

      const plugin = {
        _id: id,
        short_description: pluginInfo.shortdescription,
        title: pluginInfo.title,
        author: pluginInfo.authors,
        latest_version_date: pluginInfo.lastrelease,
        latest_version: latestFiles.name,
        latest_version_file: latestFiles,
        readme: pluginInfo.description,
        keywords: keywords,
        externalUrl: pluginInfo.url,
        external: true,
        namespace: '@bukkitdev'
      }

      return res.status(200).json(plugin)
    } catch (err) {
      return handleError(res, err)
    }
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

  const showAll = async (req, res, next) => {
    try {
      const resp = await bukkitApi.getAll()

      const plugins = await convertModel(resp)

      return res.status(200).json(plugins)
    } catch (err) {
      return handleError(res, err)
    }
  }

  const handleError = (res, err) => {
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

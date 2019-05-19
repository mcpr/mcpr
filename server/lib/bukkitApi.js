const axios = require('axios')
const bukkitApiBase = 'https://dbo.aternos.org'

const get = async endpoint => {
  const resp = await axios.get(bukkitApiBase + endpoint)
  return resp.data
}

const getPlugin = async pluginId => {
  return get(`/projects/${pluginId}`)
}

const getPluginFiles = async pluginId => {
  return get(`/projects/${pluginId}/files`)
}

const getPluginFile = async (pluginId, fileId) => {
  return get(`/projects/${pluginId}/files/${fileId}`)
}

const getAll = async () => {
  return get('/bukkit-plugins')
}

module.exports = {
  get: get,
  getAll: getAll,
  getPlugin: getPlugin,
  getPluginFiles: getPluginFiles,
  getPluginFile: getPluginFile
}

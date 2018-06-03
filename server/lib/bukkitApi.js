const axios = require('axios')
const bukkitApiBase = 'https://dbo.aternos.org'

async function get (endpoint) {
  let url = bukkitApiBase + endpoint
  const resp = await axios.get(url)
  return resp.data
}

function getPlugin (pluginId) {
  return get('/projects/' + pluginId)
}

function getPluginFiles (pluginId) {
  return get(`/projects/${pluginId}/files`)
}

function getPluginFile (pluginId, fileId) {
  return get(`/projects/${pluginId}/files/${fileId}`)
}

function getAll () {
  return get('/bukkit-plugins')
}

module.exports = {
  get: get,
  getAll: getAll,
  getPlugin: getPlugin,
  getPluginFiles: getPluginFiles,
  getPluginFile: getPluginFile
}

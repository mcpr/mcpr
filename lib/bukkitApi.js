var request = require('request-promise')
const bukkitApiBase = 'https://dbo.aternos.org'

function get (endpoint) {
  let url = bukkitApiBase + endpoint
  console.log('REQUESTING BUKKIT URL:', url)
  return request(url)
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

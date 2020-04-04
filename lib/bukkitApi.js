const axios = require('axios')
const baseURL = 'https://dbo.aternos.org'

const http = axios.create({
  baseURL
})

const get = async endpoint => {
  try {
    const resp = await http.get(endpoint)
    return resp.data
  } catch (err) {
    let error

    if (err && err.response) {
      error = new Error(err.response.statusText)
      error.statusCode = err.response.status
    }

    throw err || error
  }
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
  get,
  getAll,
  getPlugin,
  getPluginFiles,
  getPluginFile
}

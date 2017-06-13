var request = require('request-promise');
const bukkitApiBase = 'https://dbo.aternos.org';

function get(endpoint) {
    let url = bukkitApiBase + endpoint;
    console.log('REQUESTING URL:',url);
    return request(url);
}

function getPlugin(pluginId) {
    return get('/projects/' + pluginId);
}
function getAll() {
    return get('/bukkit-plugins');
}

module.exports = {
    get: get,
    getPlugin: getPlugin
}
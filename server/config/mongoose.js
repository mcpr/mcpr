const mongoose = require('mongoose')
const config = require('./config')

module.exports = () => {
  mongoose.connect(config.dbUrl)
  mongoose.Promise = Promise

  const monDb = mongoose.connection
  monDb.on('error', console.error.bind(console, 'Connection Error:'))
  monDb.once('open', function () {
    console.log('Connected Successfully to DB: ' + config.dbName)
  })
}

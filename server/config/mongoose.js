const mongoose = require('mongoose')
const config = require('./config')

module.exports = () => {
  mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  mongoose.Promise = Promise

  const monDb = mongoose.connection
  monDb.on('error', console.error.bind(console, 'Connection Error:'))
  monDb.once('open', () => {
    console.log('Connected Successfully to DB: ' + monDb.db.s.databaseName)
  })
}

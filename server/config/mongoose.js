const mongoose = require('mongoose')
const config = require('./config')

module.exports = async () => {
  const mongo = await mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  const db = mongo.connection.db

  console.log(`MongoDB opened: ${db.databaseName}`)

  db.on('error', console.error.bind(console, 'Connection Error:'))
}

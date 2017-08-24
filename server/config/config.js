const env = process.env
const path = require('path')

const config = {
  dbName: env.DB_NAME || 'mcpr',
  dbAdress: env.DB_HOST || 'localhost',
  dbPort: env.DB_PORT || '27017',
  dbUsername: env.DB_USER || '',
  dbPassword: env.DB_PASS || '',
  dbSSL: env.DB_SSL || false,
  dbRS: env.DB_REPLICA_SET || '',
  dbUrl: function () {
    let dbUrl = `mongodb://${config.dbAdress}:${config.dbPort}/${config.dbName}`
    if (env.DB_SSL) {
      dbUrl += `?ssl=${env.DB_SSL}`
    }
    if (env.DB_REPLICA_SET) {
      dbUrl += `&replicaSet=${env.DB_REPLICA_SET}`
    }
    console.log(dbUrl)
    return dbUrl
  },
  secret: env.MCPR_KEY || '',
  port: process.env.PORT || 3000,
  s3Bucket: env.S3_BUCKET || 'download.mcpr.io',
  rootPath: path.normalize(path.join(__dirname, '/../')),
  projectPath: path.normalize(path.join(__dirname, '/../../'))
}

module.exports = config

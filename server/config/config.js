const env = process.env
const path = require('path')

const secure = function () {
  if (env.SMTP_SECURE === 'false') {
    return false
  } else {
    return true
  }
}
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
  port: env.PORT || 3000,
  s3Bucket: env.S3_BUCKET || 'download.mcpr.io',
  rootPath: path.normalize(path.join(__dirname, '/../')),
  projectPath: path.normalize(path.join(__dirname, '/../../')),
  AIIK: env.APPINSIGHTS_INSTRUMENTATIONKEY,
  gaCode: env.GA_CODE,
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: secure(),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  },
  smtpFrom: env.SMTP_FROM || '"MCPR" <noreply@mcpr.io>',
  externalUrl: env.EXTERNAL_URL || 'https://mcpr.io',
  recaptchaKey: env.RECAPTCHA_KEY
}
module.exports = config

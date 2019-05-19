const env = process.env
const path = require('path')
const yn = require('yn')

const config = {
  dbUrl: env.MONGODB_URI || 'mongodb://localhost:27017/mcpr',
  secret: env.MCPR_KEY || '',
  port: env.PORT || 3000,
  s3Bucket: env.S3_BUCKET || 'download.mcpr.io',
  rootPath: path.normalize(path.join(__dirname, '/../')),
  projectPath: path.normalize(path.join(__dirname, '/../../')),
  gaCode: env.GA_CODE,
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: yn(env.SMTP_SECURE),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  },
  smtpFrom: env.SMTP_FROM || '"MCPR" <noreply@mcpr.io>',
  externalUrl: env.EXTERNAL_URL || 'https://mcpr.io',
  recaptchaKey: env.RECAPTCHA_KEY,
  cdnUrl: env.CDN_URL
}
module.exports = config

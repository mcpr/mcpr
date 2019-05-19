const nodemailer = require('nodemailer')

module.exports = (user, config) => {
  const transporter = nodemailer.createTransport(config.smtp)

  // setup email data with unicode symbols
  const mailOptions = {
    from: config.smtpFrom,
    to: user.email,
    subject: 'MCPR Email Verification',
    text: `Please verify your email address by clicking the link below.\n${config.externalUrl}/verify/${user._id}/${user.__private.verificationCode}`, // plain text body
    html: `<p>Please verify your email address by clicking the link below.</p><br><p><a href="${config.externalUrl}/verify/${user._id}/${user.__private.verificationCode}">Verify</a></p>` // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log(`Message sent: ${info.messageId}`)
  })
}

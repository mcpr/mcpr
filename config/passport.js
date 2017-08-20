var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt
var User = require('../api/v1/users/user.model')
var config = require('../config/config')

// Setup work and export for the JWT passport strategy
module.exports = function (passport) {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  opts.secretOrKey = config.secret
  passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
    User.findOne({
      id: jwtPayload.id
    }, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}

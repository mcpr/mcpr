const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const pkg = require('./package.json');
const nEnv = app.get('env');
const os = require('os');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const env = process.env;
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');

require('./api/users/user.model');
require('./config/passport');

// Config
const port = process.env.PORT || 3000;
const config = require('./config/config');
const mongoAddress = config.dbUrl();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.MCPR_KEY,
    resave: false,
    saveUninitialized: false
})); // session secret
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.use(function (err, req, res, next) {
  console.error(err.message);
  next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    console.log('HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! error middleware');
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({
            'message': err.name + ': ' + err.message
        });
    }
});

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

mongoose.connect(mongoAddress, {
    user: config.dbUsername,
    pass: config.dbPassword,
});

const monDb = mongoose.connection;
monDb.on('error', console.error.bind(console, 'Connection Error:'));
monDb.once('open', function () {
    console.log('Connected Successfully to DB: ' + config.dbName);
});

const router = express.Router();
router.get('/*', (req, res) => {
    res.render('app', {
        currentUrl: 'https://registry.hexagonminecraft.com' + req.originalUrl
    });
});
require('./api/api')(app);

app.use('/', router);

app.listen(port);

console.log(`Server Listening on port ${port}`);
if (nEnv === 'development') {
    console.log(`Web App: http://localhost:${port}/`);
    console.log(`Web App: http://localhost:${port}/api`);
} else {
    console.log(`Web App: http://${os.hostname()}:${port}/`);
    console.log(`Web App: http://${os.hostname()}:${port}/api`);
}
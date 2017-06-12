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

// Config
const port = process.env.PORT || 3000;
const config = {
    dbName: env.DB_NAME || 'mc-registry',
    dbAdress: env.DB_ADDRESS || 'localhost',
    dbPort: env.DB_PORT || '27017',
    dbUsername: env.DB_USER || '',
    dbPassword: env.DB_PASS || ''
}

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

const mongoAddress = `mongodb://${config.dbAdress}:${config.dbPort}/${config.dbName}`;

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
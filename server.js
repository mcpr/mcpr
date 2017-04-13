var express = require('express');
var app = express();
var pkg = require('./package.json');
var port = 3000;
var env = app.get('env');
var os = require('os');
var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(morgan('dev'));

var router = express.Router();
router.get('/', function (req, res) {
    res.json({
        name: pkg.name,
        version: pkg.version,
        homepage: pkg.homepage
    });
});

app.use('/api', router);

app.listen(port);

console.log(`Server Listening on port ${port}`);
if (env === 'development') {
    console.log(`API Address: http://localhost:${port}/api`);
} else {
    console.log(`API Address: http://${os.hostname()}:${port}/api`);
}
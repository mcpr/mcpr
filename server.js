const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const pkg = require('./package.json');
const nEnv = app.get('env');
const os = require('os');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const showdown = require('showdown');
const converter = new showdown.Converter();
const Handlebars = require('handlebars');
const mongoose = require('mongoose');

// Config
const port = process.env.PORT || 3000;
const dbname = 'mc-registry';

// Handlebars markdown to html converter
Handlebars.registerHelper('markdown', function (markdown) {
    var html = converter.makeHtml(markdown);

    return new Handlebars.SafeString(html);
});

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

const mongoAddress = 'mongodb://localhost/' + dbname;

mongoose.connect(mongoAddress, {
    user: app.get('dbuser'),
    pass: app.get('dbpwd'),
});

const monDb = mongoose.connection;
monDb.on('error', console.error.bind(console, 'Connection Error:'));
monDb.once('open', function () {
    console.log('Connected Successfully to DB: ' + dbname);
});


const router = express.Router();
router.get('/*', (req, res) => {
    res.render('app');
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
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

// Config
const port = process.env.PORT || 3000;
const dbname = 'mc-registry';
const nano = require('nano')('https://db.filiosoft.com');
const db = nano.db.use('mc-registry');

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


const router = express.Router();
router.get('/', (req, res) => {
    function render(list) {
        res.render('home', {
            title: 'Home - MC Registry',
            plugins: list,
            currentUrl: `https://registry.hexagonminecraft.com`
        });
    }
    db.list({
        limit: 12
    }, function (err, body) {
        const list = [];
        if (err) {
            console.log(err);
        }
        var itemsProcessed = 0;
        body.rows.forEach((item, index, array) => {
            db.get(item.id, (err, body) => {
                if (err) {
                    console.log(err);
                }
                list.push(body);
                itemsProcessed++;
                if (itemsProcessed === array.length) {
                    render(list);
                }
            });
        });
    });
});

router.get('/plugin/:id', (req, res) => {
    db.get(req.params.id, (err, body) => {
        if (!err) {
            console.log(err);
        }
        console.log('Body: ' + body);
        console.dir(body);
        var data = {
            title: req.params.id,
            currentUrl: `https://registry.hexagonminecraft.com/plugin/${req.params.id}`,
            description: body.short_description,
            plugin: body,
            id: req.params.id
        };
        res.render('plugin', data);
    });
});

router.get('/how/:id', (req, res) => {
    res.render('how', {
        title: `Help ${req.params.id}`,
        id: req.params.id,
        currentUrl: `https://registry.hexagonminecraft.com/how/${req.params.id}`
    });
});

router.get('/user/:id', (req, res) => {
    res.send(req.params);
});

router.get('/version', (reg, res) => {
    res.json({
        name: pkg.name,
        version: pkg.version,
        homepage: pkg.homepage
    });
});

app.use('/', router);

app.listen(port);

console.log(`Server Listening on port ${port}`);
if (nEnv === 'development') {
    console.log(`Web App: http://localhost:${port}/`);
} else {
    console.log(`Web App: http://${os.hostname()}:${port}/`);
}
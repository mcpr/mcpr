var express = require('express');
var app = express();
var pkg = require('./package.json');
var port = 3000;
app.get('/', function (req, res) {
    var response = {
        'name': pkg.name,
        'version': pkg.version,
        'homepage': pkg.homepage
    };
    res.send(response);
});

app.listen(port, function () {
    console.log(`MC Registry listening on port ${port}!`);
});
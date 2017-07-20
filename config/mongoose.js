const mongoose = require('mongoose');
const config = require('./config');
const mongoAddress = config.dbUrl();

module.exports = function () {
    mongoose.connect(mongoAddress, {
        user: config.dbUsername,
        pass: config.dbPassword,
    });

    const monDb = mongoose.connection;
    monDb.on('error', console.error.bind(console, 'Connection Error:'));
    monDb.once('open', function () {
        console.log('Connected Successfully to DB: ' + config.dbName);
    });
};
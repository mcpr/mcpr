const env = process.env;
const path = require('path');

const config = {
    dbName: env.DB_NAME || 'mc-registry',
    dbAdress: env.DB_ADDRESS || 'localhost',
    dbPort: env.DB_PORT || '27017',
    dbUsername: env.DB_USER || '',
    dbPassword: env.DB_PASS || '',
    secret: env.MCPR_KEY || '',
    port: process.env.PORT || 3000,
    dbUrl: function () {
        let dbUrl;
        if (env.DB_USER && env.DB_PASS) {
            dbUrl = `mongodb://${env.DB_USER}:${env.DB_PASS}@${config.dbAdress}:${config.dbPort}/${config.dbName}`;
        } else {
            dbUrl = `mongodb://${config.dbAdress}:${config.dbPort}/${config.dbName}`;
        }
        return dbUrl;
    },
    rootPath: path.normalize(__dirname + '/../')
};

module.exports = config;
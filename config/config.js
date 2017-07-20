const env = process.env;

const config = {
    dbName: env.DB_NAME || 'mc-registry',
    dbAdress: env.DB_ADDRESS || 'localhost',
    dbPort: env.DB_PORT || '27017',
    dbUsername: env.DB_USER || '',
    dbPassword: env.DB_PASS || '',
    secret: env.MCPR_KEY || '',
    dbUrl: function () {
        let dbUrl = `mongodb://${config.dbAdress}:${config.dbPort}/${config.dbName}`;
        return dbUrl;
    }
};

module.exports = config;
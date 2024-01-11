require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_ROOT || 'mysql',
    password: process.env.DB_PASSWORD || '123455667',
    database: process.env.DB_NAME || 'mysql',
    host: process.env.DB_HOST || 'mysql',
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

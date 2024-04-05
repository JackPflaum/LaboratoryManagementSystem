const dotenv = require('dotenv');
const path = require('path');

// get path to .env file and load up .env parameters to 'process.env' object
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({path: envPath});

// different sequelize database configurations for development, test and production environments.
const config = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

export default config;

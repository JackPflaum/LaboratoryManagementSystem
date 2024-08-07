import { Sequelize } from 'sequelize';
import config from '../config/config';


// get database configuration paramaters for specific environment (development, production, testing)
const sequelizeConfiguration = config['development'];

// confirm config enviroment was found
if (!sequelizeConfiguration) {
    throw new Error('Configuration for development environment not found.');
}

// extract config parameters
const { database, username, password, host, dialect } = sequelizeConfiguration;

// confirm parameters are not undefined
if (!database || !username || !password || !host || !dialect) {
    throw new Error('Missing required configuration parameters');
}

// create sequelize instance to establish connection to database
const sequelize = new Sequelize(database, username, password, {
        host: host,
        dialect: 'postgres',
    }
);

// test whether database connection is successful
const testDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection is successful');
    } catch (error) {
        console.log('Unable to connect to the database. ', error);
    }
};

testDatabaseConnection();

export default sequelize;
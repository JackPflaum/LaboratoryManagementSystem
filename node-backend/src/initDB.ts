import  sequelize from './database/models/db';
import Client from './database/models/Client';

// synchronize all models to connected database.
const syncDatabase = async () => {
    try {
        await Client.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.log('Error synchronizing database:', error);
    }
};


syncDatabase();

export default syncDatabase;
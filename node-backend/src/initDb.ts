import sequelize from "./database/models/db";
import Client from './database/models/Client';
import Job from './database/models/Job';
import Profile from './database/models/Profile';
import Sample from './database/models/Sample';
import SamplePhoto from './database/models/SamplePhoto';
import Test from './database/models/Test';
import User from './database/models/User';

const models = {
    User,
    Profile,
    Client,
    Job,
    Sample,
    SamplePhoto,
    Test
}

// initialize model associations
Object.values(models).forEach(model => model.associate && model.associate(models))


// synchronize all models to connect database.
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.log('Error synchronizing database:', error);
    };
};

syncDatabase();

export default syncDatabase;
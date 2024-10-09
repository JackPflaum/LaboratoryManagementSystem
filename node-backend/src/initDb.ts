import sequelize from "./database/models/db";
import User from './database/models/User';
import Profile from './database/models/Profile';
import Client from './database/models/Client';
import Job from './database/models/Job';
import Sample from './database/models/Sample';
import SamplePhoto from './database/models/SamplePhoto';
import Test from './database/models/Test';

const models = {
    User,
    Profile,
    Client,
    Job,
    Sample,
    SamplePhoto,
    Test,
};

// synchronize all models to database.
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established.");

        try {
            await sequelize.sync({ force: true });

            // Initialize model associations
            Object.values(models).forEach((model) => {
                if (model.associate) {
                    model.associate(models);
                }
            });

            console.log("Database synchronized successfully");
        } catch (error) {
            console.log("Error synchronizing database:", error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
})();

import { Model, DataTypes } from 'sequelize';
import sequelize from './db';    // import database instance from database.ts
import { ModelsInterface } from '../types/models-interface';


    interface ClientAttributes {
        name: string;
        email: string;
        phoneNumber?: string;
        address?: string;
        purchaseOrderNumber?: string;
    }

    // In Typescript '!' means the attribute must be assigned a value and '?' means it is optional
    class Client extends Model<ClientAttributes> implements ClientAttributes {
        name!: string;
        email!: string;
        phoneNumber?: string;
        address?: string;
        purchaseOrderNumber?: string;

        static associate(models: ModelsInterface) {
            Client.hasMany(models.Job, {foreignKey: "clientId"});    // establish hasMany relationship with Job model
        }
    }


    Client.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        purchaseOrderNumber: {
            type: DataTypes.STRING,
            unique: true,
        }
    }, {
        sequelize,    // Pass the sequelized instance. It tells which database instance to use for that model.
        modelName: 'Client',
        tableName: 'clients',
        timestamps: true,
    });

    export default Client;

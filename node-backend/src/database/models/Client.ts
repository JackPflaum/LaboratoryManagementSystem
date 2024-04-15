import { Model, DataTypes } from 'sequelize';
import sequelize from '../models/db';    // import database instance from database.ts


interface ClientAttributes {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    purchaseOrderNumber?: string;
}

// In Typescript '!' means the attribute must be assigned a value and '?' means it is optional
class Client extends Model<ClientAttributes> implements ClientAttributes {
    id!: number;
    name!: string;
    email!: string;
    phoneNumber?: string;
    address?: string;
    purchaseOrderNumber?: string;

    // timestamps
    readonly createdAt!: Date;
    readonly updatedAt!: Date;


    static associate(models: any) {
        Client.hasMany(models.Job);    // establish hasMany relationship with Job model
    }
}


Client.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
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
});

export default Client;

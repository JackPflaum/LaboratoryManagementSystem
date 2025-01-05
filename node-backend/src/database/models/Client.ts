import { Model, DataTypes } from 'sequelize';
import sequelize from './db';    // import database instance from database.ts
import { ModelsInterface, ClientAttributes } from '../types/models-interface';
import Job from './Job';

// In Typescript '!' means the attribute must be assigned a value and '?' means it is optional
class Client extends Model<ClientAttributes> implements ClientAttributes {
    id!: number;
    name!: string;
    email!: string;
    phoneNumber?: string;
    addressLine?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    fullAddress?: string;    // virtual field
    purchaseOrderNumber?: string;
    jobs?: Job[];

    static associate(models: ModelsInterface) {
        Client.hasMany(models.Job, { foreignKey: "clientId" });    // establish hasMany relationship with Job model
    }
};

Client.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
    addressLine: {
        type: DataTypes.STRING,
    },
    suburb: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    postcode: {
        type: DataTypes.STRING,
    },
    fullAddress: {
        type: DataTypes.VIRTUAL,
        get() {
            if (!this.addressLine || !this.suburb || !this.state || !this.postcode) {
                return "";
            }
            return `${this.addressLine}, ${this.suburb} ${this.state} ${this.postcode}`;
        },
        set(value: string) {
            throw new Error("Do not try to set the 'fullAddress' value");
        }
    },
    purchaseOrderNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
}, {
    sequelize,    // Pass the sequelized instance. It tells which database instance to use for that model.
    modelName: 'Client',
    tableName: 'clients',
    timestamps: true,
});

export default Client;

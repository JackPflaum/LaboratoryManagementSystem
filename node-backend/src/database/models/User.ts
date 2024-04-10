import { Model, DataTypes } from 'sequelize';
import sequelize from '../models/db';    // import database instance from database.ts


interface UserAttributes {
    firstName: string;
    lastName: string;
    workEmail: string;
    password: string;
}


class User extends Model<UserAttributes> implements UserAttributes {
    firstName!: string;
    lastName!: string;
    workEmail!: string;
    password!: string;

    static associate(models: any) {
        User.hasMany(models.Sample, {foreignKey: 'userId'});
        User.hasOne(models.Profile, {foreignKey: 'userId'});
    }
}

User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    workEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});


export default User;

import { Model, DataTypes } from 'sequelize';
import sequelize from '../models/db';    // import database instance from database.ts


interface ProfileAttributes {
    personalEmail: string;
    phoneNumber: string;
    position: string;
    dateStarted: Date;
}


class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    personalEmail?: string;
    phoneNumber?: string;
    position?: string;
    dateStarted!: Date;

    static associate(models: any) {
        Profile.belongsTo(models.User, {foreignKey: 'userId'});
    }
}


Profile.init({
    personalEmail: {
        type: DataTypes.STRING,
        validate: {
            isEmail: {
                msg: 'Please enter a valid email address.'
            },
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    position: {
        type: DataTypes.STRING,
    },
    dateStarted: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        },
    },
},  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});


export default Profile;

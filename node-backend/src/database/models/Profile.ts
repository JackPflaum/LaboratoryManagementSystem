import { Model, DataTypes } from "sequelize"
import sequelize from "./db";
import { ModelsInterface } from "../types/models-interface";
import User from "../models/User"

interface ProfileAttributes {
    userId: number;
    personalEmail?: string;
    phoneNumber?: string;
    position?: string;
    dateStarted: Date;
}

class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    userId!: number;
    personalEmail?: string;
    phoneNumber?: string;
    position?: string;
    dateStarted!: Date;

    static associate(models: ModelsInterface) {
        Profile.belongsTo(models.User, {foreignKey: "userId", onDelete: "CASCADE"});
        Profile.hasMany(models.Test, {foreignKey: "testId"});
    }
}

Profile.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        }
    },
    personalEmail: {
        type: DataTypes.STRING,
        validate: {
            isEmail: {
                msg: "Please enter a valid email address."
            },
        },
    },
    phoneNumber: {
        type: DataTypes.STRING
    },
    position: {
        type: DataTypes.STRING
    },
    dateStarted: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        },
    },
}, {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: true,
});

export default Profile;
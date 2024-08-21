import { Model, DataTypes } from "sequelize"
import sequelize from "./db";
import { ModelsInterface, ProfileAttributes } from "../types/models-interface";
import User from "../models/User"

class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    id!: number;
    userId!: number;
    personalEmail?: string;
    phoneNumber?: string;
    position?: string;
    dateStarted!: Date;

    static associate(models: ModelsInterface) {
        Profile.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
        Profile.hasMany(models.Test, { foreignKey: "testId" });
    }
}

Profile.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
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
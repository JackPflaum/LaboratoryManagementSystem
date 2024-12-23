import { Model, DataTypes } from "sequelize"
import sequelize from "./db";
import { ModelsInterface, ProfileAttributes } from "../types/models-interface";
import User from "../models/User";

class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    id!: number;
    userId!: number;
    personalEmail?: string;
    phoneNumber?: string;

    static associate(models: ModelsInterface) {
        Profile.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    }
};

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
}, {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: true,
});

export default Profile;
import { DataTypes, Model } from "sequelize";
import { ModelsInterface } from "../types/models-interface";
import sequelize from "./db";


interface UserInterface {
    firstName: string;
    lastName: string;
    workEmail: string;
    password: string;
}

class User extends Model<UserInterface> implements UserInterface {
    firstName!: string;
    lastName!: string;
    workEmail!: string;
    password!: string;

    static associate(models: ModelsInterface) {
        User.hasOne(models.Profile, {foreignKey: "userId"});
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
        validate: {
            isEmail: {
                msg: "Please enter a valid email address."
            }
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
});

export default User;
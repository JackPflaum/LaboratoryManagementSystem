import { DataTypes, Model } from "sequelize";
import { ModelsInterface, UserAttributes } from "../types/models-interface";
import sequelize from "./db";
import * as bcrypt from "bcrypt";

class User extends Model<UserAttributes> implements UserAttributes {
    id!: number;
    firstName!: string;
    lastName!: string;
    workEmail!: string;
    password!: string;
    permissions!: string[];

    static associate(models: ModelsInterface) {
        User.hasOne(models.Profile, { foreignKey: "userId" });
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return () => this.getDataValue("password");
        }
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
        beforeCreate: async (user: User) => {
            if (user.password) {
                const saltRounds = 10;
                bcrypt.hash(user.password, saltRounds)
                    .then((hash: string) => user.password = hash)
                    .catch((error: Error) => console.log(error));
            }
        },
    }
});

export default User;
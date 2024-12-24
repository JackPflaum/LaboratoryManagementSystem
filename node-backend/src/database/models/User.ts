import { DataTypes, Model } from "sequelize";
import { ModelsInterface, UserAttributes } from "../types/models-interface";
import sequelize from "./db";
import * as bcrypt from "bcrypt";
import Profile from "./Profile";
import Test from "./Test";

class User extends Model<UserAttributes> implements UserAttributes {
    id!: number;
    firstName!: string;
    lastName!: string;
    workEmail!: string;
    position!: string;
    permissions!: string[];
    dateStarted!: Date;
    password!: string;
    activeEmployee!: boolean;
    profile?: Profile;
    userTests?: Test[];

    static async hashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    static associate(models: ModelsInterface) {
        User.hasOne(models.Profile, { foreignKey: "userId", as: "profile" });
        User.hasMany(models.Test, { foreignKey: "userId", as: "userTests" });
    };
};

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
    position: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    dateStarted: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    activeEmployee: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
        beforeCreate: async (user: User) => {
            if (user.password) {
                user.password = await User.hashPassword(user.password);
            }
        },
        beforeUpdate: async (user: User) => {
            if (user.password) {
                user.password = await User.hashPassword(user.password);
            }
        },
    }
});

export default User;

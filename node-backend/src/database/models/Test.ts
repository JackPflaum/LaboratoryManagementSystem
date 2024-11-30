import { Model, DataTypes } from 'sequelize';
import sequelize from './db';    // import database instance from database.ts
import Sample from '../models/Sample';
import User from '../models/User';
import { ModelsInterface, TestAttributes } from '../types/models-interface';

class Test extends Model<TestAttributes> implements TestAttributes {
    id!: number;
    testId!: number;
    sampleId!: number;
    userId!: number;
    testName!: string;
    unit!: string;
    result?: number;
    comment?: string;

    static associate(models: ModelsInterface) {
        Test.belongsTo(models.Sample, { foreignKey: 'sampleId', onDelete: 'CASCADE', });
        Test.belongsTo(models.User, { foreignKey: 'userId' });
    };
};

Test.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    testId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sampleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sample,
            key: 'id',
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    testName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    result: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Test',
    tableName: 'tests',
    timestamps: true,
    // defaultScope: {
    //     // Exclude the `testId` field by default
    //     attributes: { exclude: ['testId'] },
    // },
});

export default Test;

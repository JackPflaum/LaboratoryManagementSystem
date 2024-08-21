import { Model, DataTypes } from 'sequelize';
import sequelize from './db';    // import database instance from database.ts
import Sample from '../models/Sample';
import Profile from '../models/Profile';
import { ModelsInterface, TestAttributes } from '../types/models-interface';

class Test extends Model<TestAttributes> implements TestAttributes {
    id!: number;
    sampleId!: number;
    profileId!: number;
    testName!: string;
    unit!: string;
    result?: number;
    comment?: string;

    static associate(models: ModelsInterface) {
        Test.belongsTo(models.Sample, { foreignKey: 'sampleId', onDelete: 'CASCADE' });
        Test.belongsTo(models.Profile, { foreignKey: 'profileId' });
    }
}


Test.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    sampleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sample,
            key: 'id',
        }
    },
    profileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Profile,
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
});


export default Test;

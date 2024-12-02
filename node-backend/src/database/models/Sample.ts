import { Model, DataTypes } from 'sequelize';
import sequelize from './db';
import { ModelsInterface, SampleAttributes } from '../types/models-interface';
import Job from './Job';
import { incrementSampleNumber } from '../../functions/miscellaneousFunctions';

class Sample extends Model<SampleAttributes> implements SampleAttributes {
    id!: number;
    jobNumber!: string;
    sampleNumber!: string;
    type!: string;
    storage!: string;
    completed!: boolean;
    comments?: string;

    static associate(models: ModelsInterface) {
        Sample.belongsTo(models.Job, { foreignKey: 'jobNumber', onDelete: 'CASCADE' });
        Sample.hasMany(models.Test, { foreignKey: "sampleId", as: "tests" });
        Sample.hasMany(models.SamplePhoto, { foreignKey: "sampleId", as: "samplePhotos" });
    };

    // creates a unique sample number
    static async createSampleNumber(jobNumber: string): Promise<string> {

        const sample = await Sample.findOne({
            where: { jobNumber: jobNumber },
            order: [["sampleNumber", "DESC"]],
        });

        if (sample === null) {
            throw new Error(`No Sample found for Job Number: ${jobNumber}`);
        };

        return incrementSampleNumber(jobNumber, sample);
    };
};


Sample.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    jobNumber: {    // foreign key field 
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Job,
            key: 'jobNumber',    // using jobNumber as the foreign key
        },
    },
    sampleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    storage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    comments: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize,
    modelName: 'Sample',
    tableName: 'samples',
    timestamps: true,
});

export default Sample;

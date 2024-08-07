import { Model, DataTypes } from 'sequelize';
import sequelize from './db';
import { ModelsInterface } from '../types/models-interface';
import Job from './Job';


interface SampleAttributes {
    jobNumber: string;
    sampleNumber: string;
    type: string;
    storage: string;
    completed: boolean;
    comments?: string;
}


class Sample extends Model<SampleAttributes> implements SampleAttributes {
    jobNumber!: string;
    sampleNumber!: string;
    type!: string;
    storage!: string;
    completed!: boolean;
    comments?: string;

    static associate(models: ModelsInterface) {
        Sample.belongsTo(models.Job, {foreignKey: 'jobNumber', onDelete: 'CASCADE'});
        Sample.hasMany(models.Test, {foreignKey: "testId"});
        Sample.hasMany(models.SamplePhoto, {foreignKey: "sampleId"});
    }
}


Sample.init({
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
    type : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    storage : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    comments : {
        type: DataTypes.TEXT,
    },
}, {
    sequelize,
    modelName: 'Sample',
    tableName: 'samples',
    timestamps: true,
});


export default Sample;

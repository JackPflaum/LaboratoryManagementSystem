import { Model, DataTypes } from 'sequelize';
import sequelize from '../models/db';
import Job from '../models/Job';


interface SampleAttributes {
    jobNumber: string;
    sampleNumber: string;
    type: string;
    storage: string;
    completed: boolean;
    photos: string;
    comments: string;
}


class Sample extends Model<SampleAttributes> implements SampleAttributes {
    jobNumber!: string;
    sampleNumber!: string;
    type!: string;
    storage!: string;
    status!: boolean;
    photos?: string;
    comments?: string;

    static associate(models: any) {
        Sample.belongsTo(models.job, {foreignKey: 'jobNumber'});
    }
}


Sample.init({
    jobNumber: {    // foreign key field
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Job',
            key: 'jobNumber',    // using jobNumber as the foreign key
        },
    },
    sampleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
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
    photos : {
        type: DataTypes.ARRAY,
    },
    comments : {
        type: DataTypes.TEXT,
    },
}, {
    sequelize,
    modelName: 'Sample',
    tableName: 'samples',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});


export default Sample;

import { Model, DataTypes } from 'sequelize';
import sequelize from './db';    // import database instance from database.ts
import Sample from '../models/Sample';
import { ModelsInterface, SamplePhotoAttributes } from '../types/models-interface';

class SamplePhoto extends Model<SamplePhotoAttributes> implements SamplePhotoAttributes {
    id!: number;
    sampleId!: number;
    photo!: Buffer;    // stored as binary data

    static associate(models: ModelsInterface) {
        SamplePhoto.belongsTo(models.Sample, { foreignKey: 'sampleId' });
    };
};

SamplePhoto.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    sampleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Sample,
            key: 'id',
        }
    },
    photo: {
        type: DataTypes.BLOB,    // stored as binary data
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'SamplePhoto',
    tableName: 'sample_photos',
    timestamps: true,
});

export default SamplePhoto;

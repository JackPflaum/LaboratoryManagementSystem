import { Model, DataTypes } from 'sequelize';
import sequelize from '../models/db';    // import database instance from database.ts


interface JobAttributes {
    jobNumber: string;
    comments: string;
    dueDate: Date;
    completed: boolean;
}


class Job extends Model<JobAttributes> implements JobAttributes {
    jobNumber!: string;
    comments?: string;
    dueDate!: Date;
    completed?: boolean;


    static associate(models: any) {
        Job.belongsTo(models.Client, {foreignKey: 'jobId'});
    }

    // creates a new job number based on the most recent job number
    static async createJobNumber(): Promise<string> {
        // get most recent job number
        const latestJobNumber = Job.findOne({
            order: [['createdAt', 'DESC']],
        });

        //
        if (latestJobNumber) {
            // split jobNumber into year and number
            const [ year, number ] = latestJobNumber.split('-');
            const newNumber = parseInt(number, 10) + 1;    // using 10 base to ensure unexpected behavior e.g. leading zeroes.
            return `${year}-${newNumber}`;
        } else {
            const currentYear = new Date().getFullYear().toString();
            return `${currentYear}-1`;
        }

    }
}


Job.init({
    jobNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    comments: {
        type: DataTypes.TEXT,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: true,
        },
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});


export default Job;

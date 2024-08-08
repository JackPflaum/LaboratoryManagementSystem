import { Model, DataTypes } from "sequelize";
import { ModelsInterface } from "../types/models-interface";
import sequelize from "./db";
import Client from "./Client";
import { JobAttributes } from "../types/models-interface";

class Job extends Model<JobAttributes> implements JobAttributes {
    id!: number;
    clientId!: number;
    jobNumber!: string;
    comments?: string;
    dueDate!: Date;
    completed?: boolean;

    static associate(models: ModelsInterface) {
        Job.belongsTo(models.Client, { foreignKey: "clientId" });
        Job.hasMany(models.Sample, { foreignKey: "jobNumber" });
    }

    // create a new job number based on the most recent job number
    static async createJobNumber(): Promise<string> {
        // get most recent job number
        const latestJobNumber = await Job.findOne({
            order: [['createdAt', 'DESC']],
        });

        if (latestJobNumber) {
            // split jobNumber into year and number
            const [year, number] = latestJobNumber.jobNumber.split("-");
            const newNumber = parseInt(number, 10) + 1;  // using 10 base to ensure unexpected behavior e.g. leading zeroes.
            return `${year}-${newNumber}`;
        } else {
            const currentYear = new Date().getFullYear().toString();
            return `${currentYear}-1`;
        }
    }
}

Job.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: "id"
        },
    },
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
    }
}, {
    sequelize,
    modelName: "Job",
    tableName: "jobs",
    timestamps: true
});

export default Job;

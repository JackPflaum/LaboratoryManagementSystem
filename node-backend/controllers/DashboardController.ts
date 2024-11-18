import { Request, Response } from 'express';
import Job from '../src/database/models/Job';
import Sample from '../src/database/models/Sample';
import { Op } from 'sequelize';


// handle Dashboard requests
export class DashboardController {

    // get Dashboard data
    static async getDashboard(req: Request, res: Response) {
        try {
            // get the number of pending jobs
            const pendingJobsCount = await Job.count({
                where: {
                    completed: false,
                }
            });

            // get the number of pending samples
            const pendingSamplesCount = await Sample.count({
                where: {
                    completed: false,
                }
            });

            // get the number of completed jobs in the past 60days
            const completedJobsCount = await Job.count({
                where: {
                    completed: true,
                    createdAt: {
                        [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 60))
                    }
                }
            });

            return res.status(200).json({
                pendingJobsCount: pendingJobsCount,
                pendingSamplesCount: pendingSamplesCount,
                completedJobsCount: completedJobsCount,
            });
        } catch (error) {
            return res.status(500).json({ 'error': 'Internal server error' });
        };
    };
};

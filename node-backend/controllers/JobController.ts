import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Job from '../src/database/models/Job';


// maybe import from Job
interface JobAttributes {
    jobNumber: string;
    clientId: number;
    client: string;
    comments: string;
    dueDate: Date;
}


// handles requests related to job information
export class JobController {

    // retrieve number of completed jobs
    static async getCompletedJobsCount() {
        try {
            const count = await Job.count({
                where: {
                    completed: true,
                }
            });

            return count;

        } catch (error) {
            return -1;
        };
    };


    // retrieve number of pending jobs
    static async getPendingJobs() {
        try {
            const count = await Job.count({
                where: {
                    completed: false,
                }
            });

            return count;

        } catch (error) {
            return -1;
        };
    };


    // retrieve all jobs from the database
    static async getJobs(req: Request, res: Response) {
        const searchFilter = req.query.search as string;

        try {
            const jobs = await Job.findAll({
                where: searchFilter ? {
                    jobNumber: {
                        [Op.iLike]: `%${searchFilter}%`,
                    },
                } : {},
            });
            return res.status(200).json(jobs);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    };


    // retrieve job from the database with specific id
    static async getJobDetails(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            return res.status(200).json(job);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };


    // add new job to the database
    static async addNewJob(req: Request, res: Response) {
        // retrieve job details from request body
        const { clientId, comments, dueDate }: JobAttributes = req.body;

        try {
            // need to confirm client exists?

            // create a new job number incremented up from most recently created job
            const jobNumber = await Job.createJobNumber();

            const newJob = await Job.create({ jobNumber, clientId, comments, dueDate });
            return res.status(201).json(newJob);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };


    // update an existing job in the database
    static async updateJobDetails(req: Request, res: Response) {
        const { id } = req.params;
        const { clientId, comments, dueDate }: JobAttributes = req.body;

        try {

            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            };

            // check if samples related to job are all completed
            const completed = await samplesCompleted(job);

            job.update({
                clientId: clientId,
                jobNumber: job.jobNumber,
                comments: comments,
                dueDate: dueDate,
                completed: completed,
            });

            return res.status(200).json({ success: "Job Details updated" });
        } catch (error) {
            console.log('updateJobDetails() Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        };
    };


    // handle deleting Job
    static async deleteJob(req: Request, res: Response) {
        const jobId = req.params.id as string;

        try {
            const job = await Job.findByPk(jobId);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            };

            await job.destroy();

            return res.status(200).json({ success: "Job deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };
};

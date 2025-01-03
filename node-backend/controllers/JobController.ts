import { Request, Response } from 'express';
import { literal, Op } from 'sequelize';
import Job from '../src/database/models/Job';
import Client from '../src/database/models/Client';


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

    // retrieve all jobs from the database
    static async getJobs(req: Request, res: Response) {
        const searchFilter = req.query.search as string;
        const clientId = parseInt(req.query.clientId as string, 10);

        // search Job based on below conditions
        const whereCondition: any = {};

        if (clientId) {
            whereCondition.clientId = clientId
        }

        if (searchFilter) {
            whereCondition.jobNumber = {
                [Op.iLike]: `%${searchFilter}%`
            }
        };

        try {
            const jobs = await Job.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Client,
                        as: "Client",
                        attributes: ["name"],
                    }
                ],
                // using sequelize.literal to add the client name as a direct field
                attributes: {
                    include: [
                        [literal(`"Client"."name"`), "client"]
                    ]
                },
                order: [["jobNumber", "DESC"]]
            });

            return res.status(200).json(jobs);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    };


    // retrieve job from the database with specific id
    static async getJobDetails(req: Request, res: Response) {
        const { jobNumber } = req.params;
        try {
            const job = await Job.findOne({
                where: {
                    jobNumber: jobNumber,
                },
                include: [
                    {
                        model: Client,
                        as: "Client",
                        attributes: ["name"],
                    }
                ],
                attributes: {
                    include: [
                        [literal(`"Client"."name"`), "client"]
                    ]
                }
            });

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            };

            return res.status(200).json(job);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };


    // add new job to the database
    static async addNewJob(req: Request, res: Response) {
        // retrieve job details from request body
        const { client, comments, dueDate }: JobAttributes = req.body;

        try {
            // need to get client id
            const selectedClient = await Client.findOne({ where: { name: client } });

            if (!selectedClient) {
                return res.status(404).json({ error: 'Client not found' });
            };

            const clientId = selectedClient.id;

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
        const { client, comments, dueDate }: JobAttributes = req.body.data;

        try {
            // find job in database
            const job = await Job.findByPk(id);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            };

            // need to get client id
            const selectedClient = await Client.findOne({ where: { name: client } });

            if (!selectedClient) {
                return res.status(404).json({ error: 'Client not found' });
            };

            const clientId = selectedClient.id;

            job.update({
                clientId: clientId,
                jobNumber: job.jobNumber,
                comments: comments,
                dueDate: dueDate,
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

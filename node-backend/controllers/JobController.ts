import { Request, Response } from 'express';
import { literal, Op } from 'sequelize';
import Job from '../src/database/models/Job';
import Client from '../src/database/models/Client';
import { handleSequelizeErrors } from '../src/custom/SequelizeErrorHandler';
import { io } from '../src/server';


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
            return handleSequelizeErrors(error, res);
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
            return handleSequelizeErrors(error, res);
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

            await Job.create({ jobNumber, clientId, comments, dueDate });

            // broadcast new "Job" via WebSocket to connected clients
            if (io.sockets.sockets.size > 0) {
                io.emit("message", {
                    type: "job",
                    action: "added",
                    timestamp: new Date().toISOString(),
                });
            };

            return res.status(201).json({ success: "New Job was created." });
        } catch (error) {
            return handleSequelizeErrors(error, res);
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

            const jobData = await job.update({
                clientId: clientId,
                jobNumber: job.jobNumber,
                comments: comments,
                dueDate: dueDate,
            }, { validate: true });

            // remove sequelize metadata
            const updatedJob = jobData.get({ plain: true });

            // after updating, broadcast the "jobUpdate" event to all connected clients
            if (io.sockets.sockets.size > 0) {
                io.emit("message", {
                    type: "job",
                    action: "updated",
                    id: id,
                    data: updatedJob,
                    timestamp: new Date().toISOString(),
                });
            };

            return res.status(200).json({ success: "Job Details updated" });
        } catch (error) {
            return handleSequelizeErrors(error, res);
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

            if (io.sockets.sockets.size > 0) {
                io.emit("message", {
                    type: "job",
                    action: "deleted",
                    timestamp: new Date().toISOString(),
                });
            };

            return res.status(200).json({ success: "Job deleted successfully" });
        } catch (error) {
            return handleSequelizeErrors(error, res);
        };
    };
};
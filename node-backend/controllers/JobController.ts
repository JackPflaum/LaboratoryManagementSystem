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

    // retrieve all jobs from the database
    static async getJobs(req: Request, res: Response) {
        try {
            const jobs = await Job.findAll();
            res.status(200).json(jobs);
        } catch (error) {
            console.log('getJobs() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.send('List of Jobs');
    }


    // retrieve job from the database with specific id
    static async getJobDetails(req: Request, res: Response) {
        const { jobId } = req.params;
        try {
            const job = await Job.findByPk(jobId);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            res.status(200).json(job);
        } catch (error) {
            console.log('getJobDetails() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.send('Individual Job details');
    }


    // add new job to the database
    static async addNewJob(req: Request, res: Response) {
        try {
            // retrieve job details from request body
            const { clientId, comments, dueDate }: JobAttributes = req.body;

            // need to confirm client exists

            // create a new job number incremented up from most recently created job
            const jobNumber = await Job.createJobNumber();

            const newJob = await Job.create({ jobNumber, clientId, comments, dueDate});
            res.status(201).json(newJob);
        } catch (error) {
            console.log('addNewJob() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.send('Add New Job');
    }


    // update an existing job in the database
    static async updateJobDetails(req: Request, res: Response) {
        try {
            
        } catch (error) {
            console.log('updateJobDetails() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
        res.send('Job Details updated');
    }
}
import { Request, Response } from 'express';


export class JobController {
    static getJobs(req: Request, res: Response) {
        res.send('List of Jobs');
    }

    static getJobDetails(req: Request, res: Response) {
        res.send('Individual Job details');
    }

    static addNewJob(req: Request, res: Response) {
        res.send('Add New Job');
    }

    static updateJobDetails (req: Request, res: Response) {
        res.send('Job Details updated');
    }
}
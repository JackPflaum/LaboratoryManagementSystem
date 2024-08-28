import { Request, Response } from 'express';
import Sample from '../src/database/models/Sample';


interface SampleAttributes {
    jobNumber: string;
    sampleNumber: string;
    dateRecieved: Date;
    type: string;
    storage: string;
    status: string;
    updated: Date;
    photo: [];
    comments: string;
}


// handles requests related to samples
export class SampleController {

    // retrieve sample from database with specified id
    static async getSampleDetails(req: Request, res: Response) {
        try {
            const { sampleId } = req.params;
            const sampleDetails = Sample.findByPk(sampleId);

            if (!sampleDetails) {
                return res.status(404).json({ 'error': 'Sample not found.' });
            }

            // respond with retieved sample data
            return res.status(200).json(sampleDetails);
        } catch (error) {
            console.log('getSample() Error:', error);
            return res.status(500).json({ 'error': 'Internal server erorr.' });
        }
    }


    // update sample details for sample with specified id
    static updateSampleDetails(req: Request, res: Response) {
        try {
            const { sampleId } = req.params;
            const { jobNumber, sampleNumber, dateRecieved, type, storage, status, updated, photo, comments }: SampleAttributes = req.body;

            // handle saving data.
            // do i need to ever change dateReceived?
        } catch (error) {
            console.log('updateSampleDetails() Error:', error);
            return res.status(500).json({ 'error': 'Internal server erorr.' });
        }
    }

}
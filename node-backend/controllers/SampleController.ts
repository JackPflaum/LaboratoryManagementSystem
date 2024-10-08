import { Request, Response } from 'express';
import Sample from '../src/database/models/Sample';
import { Op } from 'sequelize';
import { SampleAttributes } from '../src/database/types/models-interface';

// handles requests related to samples
export class SampleController {

    // get list of Samples
    static async getSamples(req: Request, res: Response) {
        const searchFilter = req.query.search as string;
        try {
            const samples = Sample.findAll({
                where: searchFilter ? {
                    sampleNumber: {
                        [Op.iLike]: `%${searchFilter}%`
                    }
                } : {}
            });

            if (!samples) {
                return res.status(404).json({ error: "No sample found." });
            };

            // respond with retieved sample data
            return res.status(200).json(samples);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    };


    // retrieve sample from database with specified id
    static async getSampleDetails(req: Request, res: Response) {
        try {
            const { sampleId } = req.params;
            const sampleDetails = Sample.findByPk(sampleId);

            if (!sampleDetails) {
                return res.status(404).json({ error: 'Sample not found.' });
            }

            // respond with retieved sample data
            return res.status(200).json(sampleDetails);
        } catch (error) {
            console.log('getSample() Error:', error);
            return res.status(500).json({ 'error': 'Internal server erorr.' });
        };
    };


    // add a new sample to the database
    static async addNewSample(req: Request, res: Response) {
        const {
            jobNumber,
            type,
            storage,
            completed,
            comments }: SampleAttributes = req.body;
        try {
            await Sample.create({ jobNumber, type, storage, completed, comments });
            return res.status(201).json({ success: "New Sample has been created" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };


    // update sample details for sample with specified id
    static async updateSampleDetails(req: Request, res: Response) {
        const sampleId = req.params.id as string;
        const {
            type,
            storage,
            completed,
            comments }: SampleAttributes = req.body;
        try {
            const sample = await Sample.findByPk(sampleId);

            if (!sample) {
                return res.status(404).json({ error: 'Sample not found' });
            };

            await sample.update({ type, storage, completed, comments });
            return res.status(201).json({ success: "Sample Details updated" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }


    // handle deleting Sample
    static async deleteSample(req: Request, res: Response) {
        const sampleId = req.params.id as string;

        try {
            const sample = await Sample.findByPk(sampleId);

            if (!sample) {
                return res.status(404).json({ error: 'Sample not found' });
            };

            await sample.destroy();

            return res.status(200).json({ success: "Sample deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };
};

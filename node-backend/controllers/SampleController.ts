import { Request, Response } from 'express';
import Sample from '../src/database/models/Sample';
import { Op } from 'sequelize';
import { SampleAttributes } from '../src/database/types/models-interface';
import Job from '../src/database/models/Job';
import sequelize from '../src/database/models/db';
import Test from '../src/database/models/Test';
import { incrementSampleNumber } from '../src/functions/miscellaneousFunctions';

// handles requests related to samples
export class SampleController {

    // get list of Samples
    static async getSamples(req: Request, res: Response) {
        const searchFilter = req.query.search as string;
        const jobId = req.query.jobId as string;
        const userId = req.query.userId as string;

        const whereCondition: any = {};

        if (jobId) {
            const job = await Job.findByPk(jobId)
            whereCondition.jobNumber = {
                [Op.iLike]: job?.jobNumber
            };
        };

        if (searchFilter) {
            whereCondition.sampleNumber = {
                [Op.iLike]: `%${searchFilter}%`
            };
        };

        try {
            const samples = await Sample.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Test,
                        as: "tests",
                        // attributes: ['id'],
                        attributes: { exclude: ['testId'] },
                        where: userId ? { userId: userId } : {},
                    }
                ]
            });

            // respond with retieved sample data
            return res.status(200).json(samples);
        } catch (error) {
            console.error("Error fetching samples:", error);
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
            return res.status(500).json({ error: 'Internal server erorr.' });
        };
    };


    static async addNewSample(req: Request, res: Response) {
        const {
            jobNumber,
            type,
            storage,
            completed,
            comments,
            numberOfSamples,
            tests }: SampleAttributes & { tests: { userId: number, testName: string, unit: string }[] } = req.body;

        try {
            // wrap database operations in a single transaction, which automatically rolls back if anything fails
            await sequelize.transaction(async (t) => {
                if (numberOfSamples) {
                    // Iterate through the number of samples and create them one by one
                    for (let i = 0; i < numberOfSamples; i++) {
                        // Fetch the most recent sample number for the given jobNumber
                        const lastSample = await Sample.findOne({
                            where: { jobNumber },
                            order: [['sampleNumber', 'DESC']],
                            transaction: t
                        });

                        if (lastSample === null) {
                            throw new SampleNotFoundError(jobNumber);
                        };

                        // Increment the sample number from the last sample number
                        let newSampleNumber = incrementSampleNumber(jobNumber, lastSample);

                        // Create the new sample with the incremented sample number
                        const createdSample = await Sample.create(
                            { jobNumber, sampleNumber: newSampleNumber, type, storage, completed, comments },
                            { transaction: t }
                        );

                        // Create tests for corresponding sample
                        for (let test of tests) {
                            await Test.create(
                                { sampleId: createdSample.id, userId: test.userId, testName: test.testName, unit: test.unit },
                                { transaction: t }
                            );
                        };
                    }
                }
            });

            return res.status(201).json({ success: "New Sample has been created" });
        } catch (error) {
            console.log("ERROR: ", error);
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
            comments,
            tests }: SampleAttributes & { tests: { id: number, userId: number, testName: string, unit: string }[] } = req.body;
        try {
            const sample = await Sample.findByPk(sampleId);

            if (!sample) {
                return res.status(404).json({ error: 'Sample not found' });
            };

            await sample.update({
                type: type,
                storage: storage,
                completed: completed,
                comments: comments
            });

            // update tests
            // TODO: update both samples and tests in one transaction?
            for (let test of tests) {
                await Test.update({
                    id: id,
                    sampleId: sample.id,
                    userId: test.userId,
                    testName: test.testName,
                    unit: test.unit
                })
            };

            return res.status(201).json({ success: "Sample Details updated" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };


    // handle deleting Sample
    static async deleteSample(req: Request, res: Response) {
        const sampleId = req.params.id as string;

        try {
            const sample = await Sample.findByPk(sampleId);

            if (!sample) {
                return res.status(404).json({ error: 'Sample not found' });
            };

            // Delete associated tests manually
            await Test.destroy({
                where: { sampleId: sampleId }
            });

            await sample.destroy();

            return res.status(200).json({ success: "Sample deleted successfully" });
        } catch (error) {
            console.log("ERROR---->", error);
            return res.status(500).json({ error: 'Internal server error' });
        };
    };
};
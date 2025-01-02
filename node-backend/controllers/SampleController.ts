import { Request, Response } from 'express';
import Sample from '../src/database/models/Sample';
import { Op } from 'sequelize';
import { SampleAttributes } from '../src/database/types/models-interface';
import sequelize from '../src/database/models/db';
import Test from '../src/database/models/Test';
import { incrementSampleNumber } from '../src/functions/miscellaneousFunctions';
import Job from '../src/database/models/Job';

// handles requests related to samples
export class SampleController {

    // get list of Samples
    static async getSamples(req: Request, res: Response) {
        const searchFilter = req.query.search as string;
        const jobNumber = req.query.jobNumber as string;
        const userId = req.query.userId as string;

        const whereCondition: any = {}

        if (searchFilter) {
            whereCondition.sampleNumber = {
                [Op.iLike]: `%${searchFilter}%`
            };
        };

        if (jobNumber) {
            whereCondition.jobNumber = {
                [Op.iLike]: jobNumber
            };
        };

        // Prepare include for tests
        const includeTests: any = {
            model: Test,
            as: "tests",
        };

        // include job to get dueDate
        const includeJob: any = {
            model: Job,
            attributes: ["dueDate"]
        };

        // If userId is provided, include tests for that user only
        if (userId) {
            includeTests.where = { userId: userId };
            includeTests.required = true
        }

        try {
            const samples = await Sample.findAll({
                where: whereCondition,
                include: [
                    includeTests,
                    includeJob
                ],
                order: [["sampleNumber", "ASC"]]
            });

            // respond with retieved sample data
            return res.status(200).json(samples);
        } catch (error) {
            console.error("Error fetching samples:", error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    };


    // add new sample/s to specified 'Job Number'
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
            tests }: SampleAttributes & {
                tests:
                { id: number | undefined, userId: number, testName: string, unit: string }[]
            } = req.body;
        try {
            const sample = await Sample.findByPk(sampleId);

            if (!sample) {
                return res.status(404).json({ error: 'Sample not found' });
            };

            await sequelize.transaction(async (t) => {
                await sample.update({
                    type: type,
                    storage: storage,
                    completed: completed,
                    comments: comments
                }, { transaction: t });

                // get the current tests associated with the sample being updated
                const existingTestsIds = await Test.findAll({
                    where: { sampleId: sampleId },
                    transaction: t
                });

                // identify tests to delete (existing tests that are no longer in tests request)
                const testsToDelete = existingTestsIds.filter(existingTests =>
                    !tests.some(test => test.id === existingTests.id));

                for (let deleteTest of testsToDelete) {
                    await Test.destroy({
                        where: { id: deleteTest.id },
                        transaction: t
                    });
                };

                // create newly added tests
                for (let test of tests) {
                    if (test.id === undefined) {
                        await Test.create({
                            sampleId: parseInt(sampleId, 10),
                            testName: test.testName,
                            unit: test.unit,
                            userId: test.userId,
                        }, { transaction: t });
                    };
                };
            });

            return res.status(200).json({ success: "Sample Details updated" });
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
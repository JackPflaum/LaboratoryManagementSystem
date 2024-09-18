import { Request, Response } from 'express';
import Test from '../src/database/models/Test';
import { Op } from 'sequelize';
import { TestAttributes } from '../src/database/types/models-interface';

// handles requests related to Tests
export class TestController {

    // get list of Tests
    static async getTests(req: Request, res: Response) {
        const searchFilter = req.query.search as string;
        try {
            const tests = Test.findAll({
                where: searchFilter ? {
                    testName: {
                        [Op.iLike]: `%${searchFilter}%`
                    }
                } : {}
            });

            if (!tests) {
                return res.status(404).json({ error: "No tests found." });
            };

            return res.status(200).json(tests);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };


    // retrieve test from database with specified id
    static async getTestDetails(req: Request, res: Response) {
        try {
            const { testId } = req.params;
            const testDetails = Test.findByPk(testId);

            if (!testDetails) {
                return res.status(404).json({ error: 'Test not found.' });
            }

            return res.status(200).json(testDetails);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server erorr.' });
        };
    };


    // add a new test to the database
    static async addNewTest(req: Request, res: Response) {
        const { testName, unit, comment }: TestAttributes = req.body;
        try {
            // await Test.create({ testName, unit, comment });
            return res.status(201).json({ success: "New Test has been created" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };


    // update test details for sample with specified id
    static async updateTestDetails(req: Request, res: Response) {
        const testId = req.params.id as string;
        const { testName, unit, result, comment }: TestAttributes = req.body;
        try {
            const test = await Test.findByPk(testId);

            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            };

            await test.update({
                testName: testName,
                unit: unit,
                result: result,
                comment: comment,
            });

            return res.status(201).json({ success: "Test Details updated" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };


    // handle deleting Test
    static async deleteTest(req: Request, res: Response) {
        const testId = req.params.id as string;

        try {
            const test = await Test.findByPk(testId);

            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            };

            await test.destroy();

            return res.status(200).json({ success: "Test deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };
};

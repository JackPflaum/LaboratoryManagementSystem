import { Request, Response } from 'express';
import { TestAttributes } from '../src/database/types/models-interface';
import sequelize from '../src/database/models/db';
import Test from '../src/database/models/Test';

// handles requests related to Test results
export class ResultsController {

    // save test results
    static async saveResults(req: Request, res: Response) {
        const testsData = req.body.data as TestAttributes[];
        try {
            await sequelize.transaction(async (t) => {
                // prepare array of the update promises
                const updatePromises = testsData.map((test) => {
                    return Test.update(
                        { result: test.result },   // update result column
                        {
                            where: { id: test.id },  // only update row with matching 'id'
                            transaction: t,
                        }
                    );
                });

                await Promise.all(updatePromises);
            })
            return res.status(200).json({ success: "Results have been saved successfully." });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };
};

import { Request, Response } from 'express';
import { TestAttributes } from '../src/database/types/models-interface';
import sequelize from '../src/database/models/db';
import Test from '../src/database/models/Test';
import { samplesCompleted } from '../src/functions/miscellaneousFunctions';

// handles requests related to Test results
export class ResultsController {

    // save test results
    static async saveResults(req: Request, res: Response) {
        const testsData = req.body.data as TestAttributes[];
        try {
            await sequelize.transaction(async (t) => {
                // prepare array of the update promises
                const updatePromises = testsData.map((test) => {
                    // convert 'test.result' to float or null
                    let resultValue: number | null;
                    if (test.result !== undefined && test.result !== null) {
                        const parsed = parseFloat(test.result.toString());
                        resultValue = isNaN(parsed) ? null : parsed;
                    } else {
                        resultValue = null;
                    };

                    return Test.update(
                        { result: resultValue },   // update result column
                        {
                            where: { id: test.id },  // only update row with matching 'id'
                            transaction: t,
                        }
                    );
                });

                // wait for all test results to update
                await Promise.all(updatePromises);

                // update Sample completion status if all test results are non-null
                await samplesCompleted(testsData, t);
            });

            return res.status(200).json({ success: "Results have been saved successfully." });
        } catch (error) {
            console.error("Error during transaction:", error);
            return res.status(500).json({ error: 'Internal server error.' });
        };
    };
};

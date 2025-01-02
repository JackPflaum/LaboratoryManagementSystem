import { Transaction } from "sequelize";
import Sample from "../database/models/Sample";
import Test from "../database/models/Test";
import { SampleAttributes, TestAttributes } from "../database/types/models-interface";
import Job from "../database/models/Job";


export const incrementSampleNumber = (jobNumber: string, sample: SampleAttributes | null) => {
    // Increment the sample number from the previous ("2024-1-001" becomes "2024-1-002") or create a new one.
    if (sample?.sampleNumber) {
        // The last sample number (e.g., "2024-1-001")
        const parts = sample.sampleNumber.split("-");    // e.g. ["2024", "1", "001"]

        // increment the numeric part of the sample number
        const numberPart = parseInt(parts[2], 10);    // converts "001" to 1
        const nextNumber = numberPart + 1;

        // format the new sample number with leading zeroes
        return `${parts[0]}-${parts[1]}-${nextNumber.toString().padStart(3, "0")}`;
    }
    else {
        // If no previous sample exists, create the first sample number
        return `${jobNumber}-001`;
    };
};


// checks if all samples are completed based on whether tests have results.
export async function samplesCompleted(tests: TestAttributes[], t: Transaction): Promise<void> {
    // get all tests for given sample
    const testsData = await Test.findAll({
        where: { sampleId: tests[0].sampleId },  // assuming all tests belong to the same Sample
        attributes: ["result"],
        transaction: t
    });

    // check if all test results for the sample are non-null
    const allTestsCompleted = testsData.every((test) => test.result !== null);

    // update Sample complete status
    await Sample.update(
        { completed: allTestsCompleted },
        {
            where: { id: tests[0].sampleId },   // assuming all tests belong to the same Sample
            transaction: t
        }
    );
};


// checks if Job is completed based on whether all related Samples are complete.
export async function jobCompleted(jobNumber: string, t: Transaction): Promise<void> {
    // get all samples for given Job number
    const sample = await Sample.findAll({
        where: { jobNumber: jobNumber },
        attributes: ["completed"],
        transaction: t
    });

    // check if all samples are complete for specified Job
    const allSamplesComplete = sample.every((sample) => sample.completed === true);

    // update Job completed status
    await Job.update(
        { completed: allSamplesComplete },
        {
            where: { jobNumber: jobNumber },
            transaction: t
        }
    );
};

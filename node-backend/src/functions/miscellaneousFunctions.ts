import Sample from "../database/models/Sample";
import Test from "../database/models/Test";
import { SampleAttributes } from "../database/types/models-interface";


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
export async function samplesCompleted(jobNumber: string): Promise<boolean> {
    // Fetch all samples and include the associated tests in the same query
    const samples = await Sample.findAll({
        where: { jobNumber: jobNumber },
        include: [{
            model: Test,
            as: "tests",
            attributes: ["result"]
        }],
    });

    // iterate over all sample tests to see if results are not null.
    for (let sample of samples) {
        if (sample.tests) {
            for (let test of sample.tests) {
                if (test.result === null) {
                    return false;   // return false immediately if any test has no result
                };
            };
        };
    };

    // all tests have results if this point is reached
    return true;
};

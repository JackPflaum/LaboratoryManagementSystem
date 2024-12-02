import { SampleAttributes } from "../database/types/models-interface";


export const incrementSampleNumber = (jobNumber: string, sample?: SampleAttributes) => {
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
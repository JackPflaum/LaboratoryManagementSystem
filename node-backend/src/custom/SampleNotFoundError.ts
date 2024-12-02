class SampleNotFoundError extends Error {
    statusCode: number;

    constructor(jobNumber: string) {
        super(`No sample found for job number: ${jobNumber}`);
        this.name = 'SampleNotFoundError';
        this.statusCode = 404; // Not Found status code
    };
};

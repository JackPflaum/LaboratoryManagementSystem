import sequelize from "./database/models/db";
import User from "./database/models/User";
import Profile from "./database/models/Profile";
import Client from "./database/models/Client";
import Job from "./database/models/Job";
import Sample from "./database/models/Sample";
import SamplePhoto from "./database/models/SamplePhoto";
import Test from "./database/models/Test";

const models = {
    User,
    Profile,
    Client,
    Job,
    Sample,
    SamplePhoto,
    Test,
};

async function createMockData(jobNumber: string) {
    // First, create a Client instance, which is required by Job
    const client = await Client.create({
        id: 1,  // Assuming the Client already exists
        name: 'Mock Client',
        email: 'work@email.com'
    });

    // Create a Job instance for this client
    const job = await Job.create({
        clientId: client.id,  // Linking the Job to the Client
        jobNumber: jobNumber,
        comments: 'Mock job for testing purposes',
        dueDate: new Date(),
        completed: false,
    });

    // Create some Samples related to the job
    const sample1 = await Sample.create({
        jobNumber: job.jobNumber,  // Linking Sample to Job
        sampleNumber: 'SAMPLE001',
        type: 'Type1',
        storage: 'Storage1',
        completed: false,
    });

    const sample2 = await Sample.create({
        jobNumber: job.jobNumber,  // Linking Sample to Job
        sampleNumber: 'SAMPLE002',
        type: 'Type2',
        storage: 'Storage2',
        completed: false,
    });

    const user = await User.create({
        firstName: "Jack",
        lastName: "Flum",
        workEmail: "work@email.com",
        position: "lab tech",
        permissions: [],
        dateStarted: new Date(),
        password: "Qwerty1@ "
    })

    // Create Tests for these samples
    const test1 = await Test.create({
        sampleId: sample1.id,  // Linking Test to Sample
        userId: user.id,
        testName: 'Test1',
        unit: 'Unit1',
        result: 10,  // Assigning a result value
    });

    const test2 = await Test.create({
        sampleId: sample1.id,  // Linking Test to Sample
        userId: user.id,
        testName: 'Test2',
        unit: 'Unit2',
        result: undefined,  // No result here, simulating an incomplete test
    });

    const test3 = await Test.create({
        sampleId: sample2.id,  // Linking Test to Sample
        userId: user.id,
        testName: 'Test3',
        unit: 'Unit3',
        result: 20,  // Assigning a result value
    });

    const test4 = await Test.create({
        sampleId: sample2.id,  // Linking Test to Sample
        userId: user.id,
        testName: 'Test4',
        unit: 'Unit4',
        result: 15,  // Assigning a result value
    });

    return { job, sample1, sample2, test1, test2, test3, test4 };
};



export async function samplesCompleted(jobNumber: string): Promise<boolean> {
    // Fetch all samples and include the associated tests in the same query
    const samples = await Sample.findAll({
        where: { jobNumber: jobNumber },
        include: [{
            model: Test,
            as: "tests",
            attributes: ['result'],
        }],
    });

    // Iterate over all samples and their associated tests
    for (let sample of samples) {
        if (sample.tests) {
            for (let test of sample.tests) {
                if (test.result === null) {
                    return false;  // Return false immediately if any test has no result
                }
            }
        }
    }

    // If we make it here, all tests have results
    return true;
};


// Initialize Sequelize and run the test
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established.");

        try {
            await sequelize.sync({ force: true });

            // Initialize model associations
            Object.values(models).forEach((model) => {
                if (model.associate) {
                    model.associate(models);
                }
            });

            const jobNumber = '2024-1';  // Example job number
            const { job, sample1, sample2, test1, test2, test3, test4 } = await createMockData(jobNumber);

            // Call the samplesCompleted function to check if all samples are completed
            const isJobComplete = await samplesCompleted(jobNumber);

            console.log(`Job ${jobNumber} complete status:`, isJobComplete);  // Should print false due to incomplete test (test2)

            console.log("Database synchronized successfully");
        } catch (error) {
            console.log("Error synchronizing database:", error);
        };
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
})();

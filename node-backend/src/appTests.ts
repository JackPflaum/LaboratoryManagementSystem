import sequelize from "./database/models/db";
import Client from "./database/models/Client";
import Job from "./database/models/Job";

async function testAssociations() {
    // Create a client
    const client = await Client.create({
        name: 'Test Client',
        email: 'client@example.com',
    });

    // Create a job associated with the client
    const job = await Job.create({
        jobNumber: '2024-JOB-01',
        clientId: client.id,
        comments: 'This is a comment',
        dueDate: new Date,
    });

    // Fetch the job along with its client
    const fetchedJob = await Job.findOne({
        where: { id: job.id },
        include: Client,
    });

    console.log('Fetched Job:', fetchedJob);
    console.log('Associated Client:', fetchedJob?.clientId);
}

// Initialize Sequelize and run the test
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');
        await testAssociations();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();

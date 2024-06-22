const fastify = require('fastify')({ logger: true });
const { Worker } = require('worker_threads');

// Function to create a worker
const createWorker = async (account, recipient, subject, message) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {
            workerData: {
                email: account.email,
                password: account.password,
                to: recipient,
                subject: subject,
                text: message
            }
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};

// API endpoint to send emails
fastify.post('/send-emails', async (request, reply) => {
    const { emailAccounts, recipient, subject, message } = request.body;

    if (!emailAccounts || !recipient || !subject || !message) {
        reply.status(400).send('Missing required fields');
        return;
    }

    try {
        const workerPromises = emailAccounts.map(account => createWorker(account, recipient, subject, message));
        await Promise.all(workerPromises);
        reply.send('All emails sent successfully');
    } catch (error) {
        reply.status(500).send(`Error sending emails: ${error.message}`);
    }
});

// Start the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        fastify.log.info(`Server is running on http://localhost:3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

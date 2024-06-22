const fastify = require('fastify')({ logger: true });
const { Worker } = require('worker_threads');

// Function to validate an email account object
const validateEmailAccount = (account) => {
    if (
        !account ||
        typeof account !== 'object' ||
        !account.email ||
        !account.password ||
        !account.to ||
        !account.subject ||
        !account.text
    ) {
        return false;
    }
    return true;
};

const createWorker = async (account) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./src/worker.js', {
            workerData: account
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

fastify.get('/', async (request, reply) => {
    reply.send({ status: 'Mail Server is up' });
});

fastify.post('/send-emails', async (request, reply) => {
    const emailAccounts = request.body;

    if (!Array.isArray(emailAccounts) || emailAccounts.length === 0) {
        return reply.status(400).send({ error: 'Invalid input format' });
    }

    const invalidAccounts = emailAccounts.filter(account => !validateEmailAccount(account));
    if (invalidAccounts.length > 0) {
        return reply.status(400).send({ error: `Invalid email account objects: ${JSON.stringify(invalidAccounts)}` });
    }

    try {
        const workerPromises = emailAccounts.map(account => createWorker(account));
        await Promise.all(workerPromises);
        reply.send({ message: 'All emails sent successfully' });
    } catch (error) {
        reply.status(500).send({ error: `Error sending emails: ${error.message}` });
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

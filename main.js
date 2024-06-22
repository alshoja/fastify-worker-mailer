const { Worker } = require('worker_threads');

// Array of email accounts
const emailAccounts = [
    { email: 'linguabookings@gmail.com', password: 'vigs pome auqo yypc' },
];

const recipient = 'alshoja@gmail.com';
const subject = 'Test Email';
const message = 'This is a test email sent from Node.js';

// Function to create a worker
const createWorker = (account) => {
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

// Run workers for all email accounts
const runWorkers = async () => {
    try {
        const workerPromises = emailAccounts.map(createWorker);
        await Promise.all(workerPromises);
        console.log('All emails sent successfully');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
};

runWorkers();

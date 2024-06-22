const nodemailer = require('nodemailer');
const { parentPort, workerData } = require('worker_threads');

const { email, password, to, subject, text } = workerData;

// Function to send an email
const sendEmail = async () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });

    const mailOptions = {
        from: email,
        to: to,
        subject: subject,
        text: text
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        parentPort.postMessage(`Email sent: ${info.response}`);
    } catch (error) {
        parentPort.postMessage(`Error sending email: ${error}`);
    }
};

// Send the email
sendEmail();

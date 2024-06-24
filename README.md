# Fastify Email Sending Service

This project provides a simple REST API to send emails using worker threads. It validates email account objects and utilizes worker threads for asynchronous email processing.

## Features

- **Fastify**: A fast and low overhead web framework for Node.js.
- **Worker Threads**: Utilizes worker threads to handle email sending asynchronously.
- **Input Validation**: Validates email account objects to ensure they contain the required fields.

## Prerequisites

- Node.js (>=14.x)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/fastify-email-sending-service.git
    cd fastify-email-sending-service
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Running the Server

1. Start the server:
    ```bash
    npm start
    ```

2. The server will start and listen on `http://localhost:3000`.

## Endpoints

### Health Check

- **URL**: `/`
- **Method**: `GET`
- **Description**: Checks if the mail server is up.
- **Response**:
    ```json
    {
        "status": "Mail Server is up"
    }
    ```

### Send Emails

- **URL**: `/send-emails`
- **Method**: `POST`
- **Description**: Sends emails using worker threads.
- **Request Body**: An array of email account objects.
    ```json
    [
        {
            "email": "example@example.com",
            "password": "password123",
            "to": "recipient@example.com",
            "subject": "Hello",
            "text": "This is a test email"
        }
    ]
    ```
- **Response**: 
    - **200 OK**: If all emails are sent successfully.
        ```json
        {
            "message": "All emails sent successfully"
        }
        ```
    - **400 Bad Request**: If the input format is invalid or email account objects are invalid.
        ```json
        {
            "error": "Invalid input format"
        }
        ```
    - **500 Internal Server Error**: If there is an error sending emails.
        ```json
        {
            "error": "Error sending emails: <error message>"
        }
        ```

## Project Structure

- `src/worker.js`: Worker script to handle email sending.
- `main.js`: Main server file.
- `package.json`: Project dependencies and scripts.

## Example Worker (`src/worker.js`)

Ensure you have a worker script in `src/worker.js` that handles the email sending logic. Here is a basic example:

```javascript
const { parentPort, workerData } = require('worker_threads');
const nodemailer = require('nodemailer');

const sendEmail = async (account) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: account.email,
            pass: account.password
        }
    });

    let info = await transporter.sendMail({
        from: account.email,
        to: account.to,
        subject: account.subject,
        text: account.text
    });

    return info;
};

sendEmail(workerData)
    .then(info => {
        parentPort.postMessage(info);
    })
    .catch(error => {
        parentPort.postMessage({ error: error.message });
    });
```

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

---

Feel free to customize the README as per your project requirements and make sure to replace any placeholder text like repository URLs, etc., with actual data.

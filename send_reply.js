const { google } = require('googleapis');
const fs = require('fs/promises');
const path = require('path');

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function getAuth() {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const auth = new google.auth.OAuth2(key.client_id, key.client_secret, "http://localhost:8080");
    const token = await fs.readFile(TOKEN_PATH);
    auth.setCredentials(JSON.parse(token));
    return auth;
}

async function reply() {
    const args = process.argv.slice(2);
    const [threadId, to, subject, body] = args;

    try {
        const auth = await getAuth();
        const gmail = google.gmail({ version: 'v1', auth });

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `To: ${to}`,
            `Subject: ${utf8Subject}`,
            `Content-Type: text/plain; charset=utf-8`,
            ``,
            body
        ];
        const message = messageParts.join('\n');
        const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // Just send a fresh message to avoid "Requested entity not found" errors
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedMessage }
        });

        console.log("STATUS: REPLIED");
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

reply();

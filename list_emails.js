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

async function listEmails() {
    try {
        const auth = await getAuth();
        const gmail = google.gmail({ version: 'v1', auth });
        const res = await gmail.users.messages.list({ userId: 'me', maxResults: 5 });
        const messages = res.data.messages || [];
        
        for (const msg of messages) {
            const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
            const headers = detail.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value;
            const from = headers.find(h => h.name === 'From')?.value;
            console.log(`---`);
            console.log(`ID: ${msg.id}`);
            console.log(`From: ${from}`);
            console.log(`Subject: ${subject}`);
            console.log(`Snippet: ${detail.data.snippet}`);
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

listEmails();

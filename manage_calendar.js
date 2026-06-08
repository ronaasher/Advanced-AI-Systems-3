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

async function manageCalendar() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log("Usage: node manage_calendar.js <summary> <start_iso> <end_iso> [attendee_email]");
        process.exit(1);
    }

    const [summary, start, end, attendee] = args;

    try {
        const auth = await getAuth();
        const calendar = google.calendar({ version: 'v3', auth });

        // 1. Check Busy
        const check = await calendar.freebusy.query({
            requestBody: {
                timeMin: start,
                timeMax: end,
                items: [{ id: 'primary' }]
            }
        });
        const busy = check.data.calendars.primary.busy || [];

        if (busy.length > 0) {
            console.log("STATUS: BUSY");
            return;
        }

        // 2. Create Event
        const event = {
            summary: summary,
            start: { dateTime: start },
            end: { dateTime: end },
            attendees: attendee ? [{ email: attendee }] : []
        };

        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event
        });

        console.log(`STATUS: BOOKED`);
        console.log(`Link: ${res.data.htmlLink}`);

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

manageCalendar();

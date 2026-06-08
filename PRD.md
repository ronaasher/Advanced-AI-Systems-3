# Product Requirements Document (PRD) - Calendar Assistant Agent

## 1. Overview
The Calendar Assistant Agent is a simplified, script-based AI system designed to manage a user's schedule. It uses standalone Node.js scripts as tools to scan Gmail, check calendar availability, and book meetings.

## 2. Goals
- Automate meeting scheduling from email requests.
- Enforce working hours (Sun-Thu, 9 AM - 5 PM).
- Provide a robust, easy-to-maintain toolset for an AI agent.

## 3. System Architecture
The system follows a "Shell-Tool" architecture:
- **Tools**: Independent Node.js scripts (`list_emails.js`, `manage_calendar.js`, `send_reply.js`) that interact directly with Google APIs.
- **Orchestrator**: The Gemini CLI agent, which invokes these scripts via shell commands, processes the output, and makes decisions.

## 4. Key Components
### 4.1 list_emails.js
- Fetches the latest 5 emails from the inbox.
- Outputs snippets, senders, and subjects for the agent to analyze.

### 4.2 manage_calendar.js
- Takes a meeting summary, start time, and end time.
- Checks for conflicts (Free/Busy).
- If free, creates a calendar event.
- Returns status (BUSY or BOOKED).

### 4.3 send_reply.js
- Sends a reply to an email thread.
- Used for confirmations or suggesting alternative times.

## 5. Constraints
- **Working Hours**: Sunday-Thursday, 09:00 - 17:00.
- **Environment**: Requires Node.js and a valid `token.json` (OAuth2).
- **Authentication**: Uses a simple local helper for initial token generation.

## 6. Implementation Notes
- **Language**: Node.js (CommonJS).
- **Libraries**: `googleapis`, `google-auth-library`.
- **Authentication**: `credentials.json` (client secrets) and `token.json` (access/refresh tokens).

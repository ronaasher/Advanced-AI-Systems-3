# Calendar Assistant Agent

A simplified AI assistant that manages your schedule via Gmail and Google Calendar using standalone Node.js tools.

## Prerequisites
- Node.js (v18+)
- `credentials.json` in the project root.

## Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Authentication**:
   If `token.json` is missing, run:
   ```bash
   node auth_helper.js
   ```
   Follow the link in `url.txt` to authorize.

## Tools (Scripts)
- `node list_emails.js`: Lists recent emails.
- `node manage_calendar.js "Title" "StartISO" "EndISO"`: Checks availability and books.
- `node send_reply.js "ThreadID" "To" "Subject" "Body"`: Sends a reply.

## Usage with Gemini CLI
You can use the integrated agent:
```bash
@calendar_assistant check my emails
```

## Architecture
This project uses a "Shell-Tool" approach where the AI agent invokes small, specialized Node.js scripts to perform actions. This ensures reliability and bypasses complex environment issues.

const { execSync } = require('child_process');
const fs = require('fs');

console.log("Running Automated Validation Tests...\n");

function test(name, fn) {
    try {
        fn();
        console.log(`[PASS] ${name}`);
    } catch (err) {
        console.log(`[FAIL] ${name}: ${err.message}`);
    }
}

// 1. Check for required files
test("Prerequisite Files Exist", () => {
    const files = ['PRD.md', 'README.md', 'list_emails.js', 'manage_calendar.js', 'send_reply.js', 'token.json'];
    files.forEach(f => {
        if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
    });
});

// 2. Syntax check for Node.js scripts
test("Scripts have valid syntax", () => {
    ['list_emails.js', 'manage_calendar.js', 'send_reply.js'].forEach(f => {
        execSync(`node --check ${f}`);
    });
});

// 3. PRD Content Check
test("PRD contains Working Hours", () => {
    const prd = fs.readFileSync('PRD.md', 'utf8');
    if (!prd.includes("09:00 - 17:00") || !prd.includes("Sunday-Thursday")) {
        throw new Error("PRD missing working hours constraints.");
    }
});

console.log("\nValidation Complete.");

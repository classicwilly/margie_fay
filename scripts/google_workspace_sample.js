/**
 * Example script demonstrating how to call a few Google Workspace APIs
 * - Requires GOOGLE_SERVICE_ACCOUNT_KEY_JSON as env var
 * - `npm i googleapis` already added to dependencies
 */
import { google } from "googleapis";
import fs from "fs";

async function main() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON || "{}");
  if (!key || !key.client_email) {
    console.log(
      "Please provide GOOGLE_SERVICE_ACCOUNT_KEY_JSON in env variables.",
    );
    process.exit(1);
  }
  const auth = new google.auth.JWT(key.client_email, null, key.private_key, [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ]);
  await auth.authorize();

  // Sheets example: append a row
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SAMPLE_SPREADSHEET_ID;
  if (spreadsheetId) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          ["timestamp", new Date().toISOString(), "sample", "automated"],
        ],
      },
    });
    console.log("Appended a row to Sheets");
  } else {
    console.log(
      "No GOOGLE_SAMPLE_SPREADSHEET_ID provided, skipping Sheets append.",
    );
  }

  // Calendar example: create an event
  const calendar = google.calendar({ version: "v3", auth });
  const cal = process.env.GOOGLE_SAMPLE_CALENDAR_ID || "primary";
  const event = await calendar.events.insert({
    calendarId: cal,
    requestBody: {
      summary: "Demo: Test event",
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() },
    },
  });
  console.log("Created calendar event id:", event.data.id);

  // Drive: create a simple doc
  const drive = google.drive({ version: "v3", auth });
  const res = await drive.files.create({
    requestBody: {
      name: "Wonky-SOP-Demo",
      mimeType: "application/vnd.google-apps.document",
    },
    fields: "id",
  });
  console.log("Created doc id:", res.data.id);

  // Gmail: send a message (requires a Gmail account accessible by the service account)
  // NOTE: Service accounts cannot directly send mail for personal Gmail accounts without domain-wide delegation.
  console.log("Demo script finished successfully.");
}

main().catch((err) => {
  console.error("Demo script error", err);
  process.exit(1);
});

import { google } from "googleapis";

export default async function googleConnectorForServiceAccount() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON) {
    return null;
  }
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON);
  const auth = new google.auth.JWT(key.client_email, null, key.private_key, [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ]);
  await auth.authorize();
  return {
    auth,
    calendar: google.calendar({ version: "v3", auth }),
    tasks: google.tasks({ version: "v1", auth }),
    drive: google.drive({ version: "v3", auth }),
    gmail: google.gmail({ version: "v1", auth }),
  };
}

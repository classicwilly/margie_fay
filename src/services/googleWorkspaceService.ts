import { google } from "googleapis";

// Google Workspace API scopes we need
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/documents.readonly",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

// Types for Google Workspace data
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  status: string;
  location?: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  completed?: boolean;
  status: string;
}

export interface GoogleEmail {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  subject: string;
  from: string;
  date: string;
  isUnread: boolean;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

class GoogleWorkspaceService {
  private auth: any = null;
  private calendar?: any;
  private gmail?: any;
  private tasks?: any;
  private drive?: any;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    // Initialize Google Auth - this will be set when user signs in
    this.auth = new google.auth.GoogleAuth({
      scopes: GOOGLE_SCOPES,
    });
  }

  async signIn(): Promise<void> {
    try {
      // For web apps, we'll use Google Identity Services
      // This would typically be handled by a Google Sign-In button
      // For now, we'll assume the token is provided
      console.log("Google Workspace sign-in initiated");
    } catch (error) {
      console.error("Error signing into Google Workspace:", error);
      throw error;
    }
  }

  setAccessToken(token: string) {
    // We set access token only in-memory for direct client use if required.
    this.auth = new google.auth.GoogleAuth({ scopes: GOOGLE_SCOPES });
    try {
      // Not all clients will use this; the preferred pattern is server-side proxy.
      this.auth.setCredentials({ access_token: token });
    } catch (e) {
      /* ignore */
    }
    this.calendar = google.calendar({ version: "v3", auth: this.auth });
    this.gmail = google.gmail({ version: "v1", auth: this.auth });
    this.tasks = google.tasks({ version: "v1", auth: this.auth });
    this.drive = google.drive({ version: "v3", auth: this.auth });
  }

  async getCalendarEvents(
    maxResults: number = 10,
  ): Promise<GoogleCalendarEvent[]> {
    try {
      // If the client code has provided a cached authenticated calendar client, prefer it
      if (this.calendar) {
        const response = await this.calendar.events.list({
          calendarId: "primary",
          maxResults,
          singleEvents: true,
          orderBy: "startTime",
        });

        return (
          response.data.items?.map((event: any) => ({
            id: event.id,
            summary: event.summary || "No title",
            description: event.description,
            start: event.start,
            end: event.end,
            status: event.status,
            location: event.location,
          })) || []
        );
      }

      // Fallback: prefer server-side proxied endpoint; include the maxResults query param
      const r = await fetch(
        `/api/google/events?maxResults=${encodeURIComponent(maxResults)}`,
      );
      if (!r.ok) {
        throw new Error("Failed to fetch events");
      }
      const json = await r.json();
      return (json.events || []).map((event: any) => ({
        id: event.id,
        summary: event.summary || "No title",
        description: event.description,
        start: event.start,
        end: event.end,
        status: event.status,
        location: event.location,
      }));
    } catch (error) {
      console.error(
        "Error fetching calendar events through proxy or client:",
        error,
      );
      throw error;
    }
  }

  async getTasks(): Promise<GoogleTask[]> {
    try {
      const r = await fetch("/api/google/tasks");
      if (!r.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const json = await r.json();
      return json.tasks || [];
    } catch (err) {
      console.error("Error fetching tasks:", err);
      throw err;
    }

    try {
      const response = await this.tasks.tasks.list({
        tasklist: "@default",
      });

      return (
        response.data.items?.map((task: any) => ({
          id: task.id,
          title: task.title,
          notes: task.notes,
          due: task.due,
          completed: task.completed !== null,
          status: task.status,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getRecentEmails(maxResults: number = 10): Promise<GoogleEmail[]> {
    try {
      const r = await fetch(`/api/google/emails?max=${maxResults}`);
      if (!r.ok) {
        return [];
      }
      const json = await r.json();
      return json.emails || [];
    } catch (err) {
      console.error("Error fetching emails:", err);
      throw err;
    }

    try {
      const response = await this.gmail.users.messages.list({
        userId: "me",
        maxResults,
        q: "is:unread",
      });

      if (!response.data.messages) {
        return [];
      }

      const emails = await Promise.all(
        response.data.messages.map(async (message: any) => {
          const details = await this.gmail.users.messages.get({
            userId: "me",
            id: message.id,
          });

          const headers = details.data.payload.headers;
          const subject =
            headers.find((h: any) => h.name === "Subject")?.value || "";
          const from = headers.find((h: any) => h.name === "From")?.value || "";
          const date = headers.find((h: any) => h.name === "Date")?.value || "";

          return {
            id: message.id,
            threadId: message.threadId,
            labelIds: details.data.labelIds || [],
            snippet: details.data.snippet || "",
            subject,
            from,
            date,
            isUnread: details.data.labelIds?.includes("UNREAD") || false,
          };
        }),
      );

      return emails;
    } catch (error) {
      console.error("Error fetching emails:", error);
      throw error;
    }
  }

  async getRecentDriveFiles(
    maxResults: number = 10,
  ): Promise<GoogleDriveFile[]> {
    try {
      const r = await fetch(`/api/google/drive?max=${maxResults}`);
      if (!r.ok) {
        return [];
      }
      const json = await r.json();
      return json.files || [];
    } catch (err) {
      console.error("Error fetching drive files:", err);
      throw err;
    }

    try {
      const response = await this.drive.files.list({
        pageSize: maxResults,
        fields:
          "files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink)",
        orderBy: "modifiedTime desc",
      });

      return (
        response.data.files?.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          modifiedTime: file.modifiedTime,
          webViewLink: file.webViewLink,
          thumbnailLink: file.thumbnailLink,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching Drive files:", error);
      throw error;
    }
  }

  async createTask(
    title: string,
    notes?: string,
    due?: string,
  ): Promise<GoogleTask> {
    try {
      const r = await fetch("/api/google/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, notes, due }),
      });
      if (!r.ok) {
        throw new Error("Failed to create task");
      }
      const json = await r.json();
      return json.task;
    } catch (err) {
      console.error("Error creating task through proxy:", err);
      throw err;
    }
  }

  async createCalendarEvent(
    summary: string,
    startTime: string,
    endTime: string,
    description?: string,
    location?: string,
  ): Promise<GoogleCalendarEvent> {
    try {
      const r = await fetch("/api/google/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          startTime,
          endTime,
          description,
          location,
        }),
      });
      if (!r.ok) {
        throw new Error("Failed to create calendar event");
      }
      const json = await r.json();
      return json.event;
    } catch (err) {
      console.error("Error creating calendar event via proxy:", err);
      throw err;
    }
  }
}

// Export singleton instance
export const googleWorkspaceService = new GoogleWorkspaceService();

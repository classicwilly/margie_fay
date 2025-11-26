import { useState, useEffect, type FC } from "react";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import {
  googleWorkspaceService,
  GoogleCalendarEvent,
  GoogleTask,
  GoogleEmail,
  GoogleDriveFile,
} from "../src/services/googleWorkspaceService";
import { listCalendarEvents } from "../src/services/connectors";
import { getGrandmaAdvice } from "../src/services/geminiService";

interface DashboardProps {
  events: GoogleCalendarEvent[];
  loading: boolean;
  error: string | null;
}

const Dashboard: FC<DashboardProps> = ({ events, loading, error }) => {
  const { isAuthenticated, user, signIn, signOut, accessToken } =
    useGoogleAuth();
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [emails, setEmails] = useState<GoogleEmail[]>([]);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [geminiGuidance, setGeminiGuidance] = useState<string>("");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadWorkspaceData();
    } else {
      // If not authenticated we can still show offline or public sample events
      (async () => {
        try {
          const evts = await listCalendarEvents(true);
          // Client's prop 'events' passed from parent could be updated by parent or state; but for quick demo we won't mutate props
        } catch (err) {
          // ignore
        }
      })();
    }
  }, [isAuthenticated, accessToken]);

  const loadWorkspaceData = async () => {
    setWorkspaceLoading(true);
    try {
      const [tasksData, emailsData, driveData] = await Promise.all([
        googleWorkspaceService.getTasks(),
        googleWorkspaceService.getRecentEmails(5),
        googleWorkspaceService.getRecentDriveFiles(5),
      ]);

      setTasks(tasksData);
      setEmails(emailsData);
      setDriveFiles(driveData);

      // Generate Gemini guidance based on current workspace state
      const guidance = await generateWorkspaceGuidance(
        tasksData,
        emailsData,
        events,
      );
      setGeminiGuidance(guidance);
    } catch (err) {
      console.error("Error loading workspace data:", err);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const generateWorkspaceGuidance = async (
    tasks: GoogleTask[],
    emails: GoogleEmail[],
    events: GoogleCalendarEvent[],
  ): Promise<string> => {
    const context = {
      pendingTasks: tasks.filter((t) => !t.completed).length,
      unreadEmails: emails.filter((e) => e.isUnread).length,
      todayEvents: events.length,
      recentFiles: driveFiles.length,
    };

    const prompt = `Based on the user's current Google Workspace state:
- ${context.pendingTasks} pending tasks
- ${context.unreadEmails} unread emails
- ${context.todayEvents} calendar events today
- ${context.recentFiles} recent Drive files

Provide concise, actionable guidance as Grandma Margie would, focusing on time management and getting things done efficiently. Keep it under 100 words.`;

    try {
      const response = await getGrandmaAdvice(prompt);
      return response;
    } catch (err) {
      return "Love, Grandma. Take it one step at a time, dear. You've got this.";
    }
  };

  const createQuickTask = async (title: string) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      await googleWorkspaceService.createTask(title);
      loadWorkspaceData(); // Refresh data
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-teal p-8 text-center">
        <h1 className="text-3xl font-mono font-bold text-accent-teal mb-6">
          Margie's Workshop - Dashboard
        </h1>
        <div className="space-y-4">
          <p className="text-lg text-text-light">
            Connect your Google Workspace to unlock the full power of seamless
            task flow.
          </p>
          <button
            onClick={signIn}
            className="bg-accent-teal hover:bg-accent-teal/80 text-card-dark px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-teal p-8">
      <div className="flex justify-between items-center mb-6 border-b border-surface-700 pb-4">
        <h1 className="text-3xl font-mono font-bold text-accent-teal">
          Margie's Workshop - Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-text-light">Welcome, {user?.name}</span>
          <button
            onClick={signOut}
            className="text-accent-pink hover:text-accent-pink/80 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Today's Calendar */}
        <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-pink p-6">
          <h2 className="text-xl font-semibold text-accent-pink mb-4 flex items-center">
            📅 Today's Calendar
          </h2>
          {loading && <p className="text-text-muted">Loading events...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="text-sm p-2 bg-surface-800 rounded"
              >
                <div className="font-semibold text-accent-pink">
                  {event.summary}
                </div>
                <div className="text-text-muted">
                  {event.start.dateTime
                    ? new Date(event.start.dateTime).toLocaleTimeString()
                    : "All day"}
                </div>
              </div>
            ))}
            {events.length === 0 && !loading && (
              <p className="text-text-muted text-sm">No events today</p>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-green p-6">
          <h2 className="text-xl font-semibold text-accent-green mb-4 flex items-center">
            ✅ Tasks ({tasks.filter((t) => !t.completed).length})
          </h2>
          {workspaceLoading && (
            <p className="text-text-muted">Loading tasks...</p>
          )}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tasks
              .filter((t) => !t.completed)
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="text-sm p-2 bg-surface-800 rounded flex items-center"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    aria-label={`Mark task "${task.title}" as complete`}
                  />
                  <span className="text-accent-green">{task.title}</span>
                </div>
              ))}
            {tasks.filter((t) => !t.completed).length === 0 &&
              !workspaceLoading && (
                <p className="text-text-muted text-sm">No pending tasks</p>
              )}
          </div>
          <button
            onClick={() => createQuickTask("New task from Wonky Sprout")}
            className="mt-3 text-accent-green hover:text-accent-green/80 text-sm underline"
          >
            + Add Task
          </button>
        </div>

        {/* Emails */}
        <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-blue p-6">
          <h2 className="text-xl font-semibold text-accent-blue mb-4 flex items-center">
            📧 Recent Emails ({emails.filter((e) => e.isUnread).length} unread)
          </h2>
          {workspaceLoading && (
            <p className="text-text-muted">Loading emails...</p>
          )}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {emails.slice(0, 5).map((email) => (
              <div
                key={email.id}
                className="text-sm p-2 bg-surface-800 rounded"
              >
                <div className="font-semibold text-accent-blue truncate">
                  {email.subject}
                </div>
                <div className="text-text-muted truncate">{email.from}</div>
                {email.isUnread && (
                  <span className="text-accent-pink text-xs">●</span>
                )}
              </div>
            ))}
            {emails.length === 0 && !workspaceLoading && (
              <p className="text-text-muted text-sm">No recent emails</p>
            )}
          </div>
        </div>

        {/* Drive Files */}
        <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-purple p-6">
          <h2 className="text-xl font-semibold text-accent-purple mb-4 flex items-center">
            📁 Recent Files
          </h2>
          {workspaceLoading && (
            <p className="text-text-muted">Loading files...</p>
          )}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {driveFiles.slice(0, 5).map((file) => (
              <div key={file.id} className="text-sm p-2 bg-surface-800 rounded">
                <div className="font-semibold text-accent-purple truncate">
                  {file.name}
                </div>
                <div className="text-text-muted text-xs">
                  {new Date(file.modifiedTime).toLocaleDateString()}
                </div>
              </div>
            ))}
            {driveFiles.length === 0 && !workspaceLoading && (
              <p className="text-text-muted text-sm">No recent files</p>
            )}
          </div>
        </div>
      </div>

      {/* Gemini AI Guidance */}
      <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-teal p-6">
        <h2 className="text-xl font-semibold text-accent-teal mb-4 flex items-center">
          🤖 Grandma's AI Guidance
        </h2>
        {workspaceLoading ? (
          <p className="text-text-muted">Generating guidance...</p>
        ) : (
          <p className="text-text-light leading-relaxed">{geminiGuidance}</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

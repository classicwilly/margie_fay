import { useState } from "react";
import GoogleSignInButton from "./GoogleSignInButton";
import GitHubSignInButton from "./GitHubSignInButton";
import DiscordSignInButton from "./DiscordSignInButton";
import GitHubActions from "./GitHubActions";

export default function GoogleWorkspaceShowcase() {
  const [demoData, setDemoData] = useState<any>(null);
  const runDemo = async () => {
    try {
      const g = await fetch("/api/google/demo");
      const gj = await g.json().catch(() => ({}));
      const ghResp = await fetch("/api/github/demo").catch(() => null);
      const ghj = ghResp ? await ghResp.json().catch(() => ({})) : null;
      setDemoData({ google: gj, github: ghj });
    } catch (e) {
      setDemoData({ error: String(e) });
    }
  };

  return (
    <div className="card-base p-4">
      <div className="flex justify-end gap-3 mb-2">
        <GoogleSignInButton />
        <GitHubSignInButton />
        <DiscordSignInButton />
      </div>
      <h2 className="text-xl font-bold">Google Workspace Showcase</h2>
      <p className="text-sm text-text-muted">
        Demonstrates Calendar, Drive, Sheets, and Gmail orchestrations via
        server-side routes.
      </p>
      <div className="mt-4">
        <button
          onClick={runDemo}
          className="px-4 py-2 bg-accent-blue text-white rounded"
        >
          Run Demo
        </button>
      </div>
      <div className="mt-6">
        <h3 className="text-md font-semibold">What this does</h3>
        <ul className="list-disc list-inside">
          <li>Simulates Calendar event creation</li>
          <li>Uploads a SOP to Drive (sample)</li>
          <li>Appends weekly-review data to a Sheet</li>
          <li>Sends a mail via Gmail using a template</li>
        </ul>
      </div>
      {!!demoData && (
        <div className="mt-6 card-base p-4 bg-surface-700">
          <h3 className="text-md font-semibold">Demo result</h3>
          {demoData.error && (
            <div className="text-red-400">Error: {demoData.error}</div>
          )}
          {demoData.google?.profile && (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={demoData.profile.picture}
                alt={demoData.profile.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="text-sm">
                Signed in as <strong>{demoData.google.profile.name}</strong> (
                {demoData.google.profile.email})
              </div>
            </div>
          )}
          {Array.isArray(demoData.google?.events) && (
            <div className="mt-3">
              <h4 className="font-semibold">Upcoming Events</h4>
              <ul className="list-disc list-inside">
                {demoData.google.events.map((ev: any) => (
                  <li key={ev.id || ev.summary}>
                    {ev.summary} —{" "}
                    {String(ev.start?.dateTime || ev.start?.date || "")}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(demoData.github?.repos) && (
            <div className="mt-3">
              <h4 className="font-semibold">GitHub Repos</h4>
              <ul className="list-disc list-inside">
                {demoData.github.repos.map((r: any) => (
                  <li key={r.id || r.full_name}>
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-blue"
                    >
                      {r.full_name}
                    </a>
                    {r.description ? ` — ${r.description}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4">
            <GitHubActions />
          </div>
        </div>
      )}
    </div>
  );
}

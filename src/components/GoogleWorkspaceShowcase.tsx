import React, { useState } from "react";
import GoogleSignInButton from "./GoogleSignInButton";

export default function GoogleWorkspaceShowcase() {
  const [demoData, setDemoData] = useState<any>(null);
  const runDemo = async () => {
    try {
      const resp = await fetch("/api/google/demo");
      const json = await resp.json();
      setDemoData(json);
    } catch (e) {
      setDemoData({ error: String(e) });
    }
  };

  return (
    <div className="card-base p-4">
      <div className="flex justify-end mb-2">
        <GoogleSignInButton />
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
          {demoData.profile && (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={demoData.profile.picture}
                alt={demoData.profile.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="text-sm">
                Signed in as <strong>{demoData.profile.name}</strong> (
                {demoData.profile.email})
              </div>
            </div>
          )}
          {Array.isArray(demoData.events) && (
            <div className="mt-3">
              <h4 className="font-semibold">Upcoming Events</h4>
              <ul className="list-disc list-inside">
                {demoData.events.map((ev: any) => (
                  <li key={ev.id || ev.summary}>
                    {ev.summary} —{" "}
                    {String(ev.start?.dateTime || ev.start?.date || "")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

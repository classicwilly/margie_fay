import React, { useState } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../ContentCard.js";

const DirectMessageModule = () => {
  const { appState, dispatch } = useAppState();
  const { dashboardType, parentalAlerts } = appState;
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");

  if (dashboardType !== "willow" && dashboardType !== "sebastian") {
    return null; // Should not be rendered on other dashboards
  }

  const messagesForPersona = parentalAlerts
    .filter((alert) => alert.from === dashboardType)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    dispatch({
      type: "SEND_PARENTAL_ALERT",
      payload: {
        from: dashboardType,
        message: message.trim(),
      },
    });

    setConfirmation(`Message sent!`);
    setMessage("");

    // Clear confirmation after a few seconds
    setTimeout(() => setConfirmation(""), 3000);
  };

  return (
    <ContentCard title="📣 Direct Message to Dad">
      <p className="text-sm text-text-light text-opacity-80 mb-4">
        Need something important? Send a direct alert to Dad's dashboard.
      </p>
      <form onSubmit={handleSend} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          placeholder="Type your message here..."
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 transition-colors"
        >
          Send to Dad
        </button>
      </form>
      {confirmation && (
        <p className="mt-3 text-sm text-center text-accent-green animate-pulse">
          {confirmation}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="font-semibold text-accent-teal mb-2">Message History</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {messagesForPersona.length > 0 ? (
            messagesForPersona.map((alert) => (
              <div
                key={alert.id}
                className={`p-2 rounded-md border ${alert.status === "acknowledged" ? "bg-gray-800 border-gray-700" : "bg-accent-blue/10 border-accent-blue/30"}`}
              >
                <p className="text-sm text-text-light">{alert.message}</p>
                <div
                  className={`text-xs mt-1 font-semibold ${alert.status === "acknowledged" ? "text-accent-green" : "text-accent-blue animate-pulse"}`}
                >
                  {alert.status === "acknowledged"
                    ? "Seen by Dad ✅"
                    : "Sent..."}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500 p-4">
              No messages sent yet.
            </p>
          )}
        </div>
      </div>
    </ContentCard>
  );
};

export default DirectMessageModule;

import { useState, useEffect } from "react";
import type { FC } from "react";
import { discordService } from "../services/discordService";

interface DiscordAdminSettingsProps {
  isAdmin: boolean;
}

const DiscordAdminSettings: FC<DiscordAdminSettingsProps> = ({ isAdmin }) => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasToken, setHasToken] = useState(false);

  const handleSave = async () => {
    setMessage("");
    setError("");
    if (!token) {
      setError("Token cannot be empty.");
      return;
    }
    try {
      await discordService.setServiceToken(token);
      setMessage("Discord service token saved successfully.");
      setToken(""); // Clear token after successful save
    } catch (err: any) {
      setError(`Failed to save token: ${err.message || err}`);
    }
  };

  const handleRevoke = async () => {
    setMessage("");
    setError("");
    try {
      await discordService.revokeServiceToken();
      setMessage("Discord service token revoked.");
      setHasToken(false);
    } catch (err: any) {
      setError(`Failed to revoke token: ${err.message || err}`);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const status = await discordService.getServiceTokenStatus();
        if (mounted) {
          setHasToken(Boolean(status?.hasToken));
        }
      } catch (e) {
        // no-op
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="discord-admin-settings card">
      <h3>Discord Bot Service Token</h3>
      <p>
        Set the Discord bot service token for background operations (e.g., voice
        playback).
      </p>
      <input
        type="password"
        placeholder="Enter Discord Bot Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="input input-bordered w-full max-w-xs"
      />
      <button onClick={handleSave} className="btn btn-primary mt-2">
        Save Service Token
      </button>
      {hasToken && (
        <button onClick={handleRevoke} className="btn btn-warning mt-2 ml-2">
          Revoke Service Token
        </button>
      )}
      {message && <p className="text-success mt-2">{message}</p>}
      {error && <p className="text-error mt-2">{error}</p>}
    </div>
  );
};

export default DiscordAdminSettings;

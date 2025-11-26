import { useEffect, useState } from "react";
import { discordService } from "../services/discordService";

export default function DiscordSignInButton() {
  const [profile, setProfile] = useState<any>(null);

  const loadProfile = async () => {
    try {
      const resp = await fetch("/api/discord/me");
      if (resp.status === 200) {
        const json = await resp.json();
        setProfile(json.profile);
      } else {
        setProfile(null);
      }
    } catch (e) {
      setProfile(null);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const signIn = () => discordService.signIn();
  const signOut = async () => {
    await discordService.signOut();
    setProfile(null);
  };

  if (profile) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={
            profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : "/img/discord-default-avatar.png"
          }
          alt={profile.username}
          className="h-8 w-8 rounded-full"
        />
        <div className="font-mono text-sm">{profile.username}</div>
        <button
          onClick={signOut}
          className="ml-2 px-2 py-1 text-xs bg-surface-700 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      Sign in with Discord
    </button>
  );
}

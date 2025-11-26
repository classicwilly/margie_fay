import { useEffect, useState } from "react";
import { githubService } from "../services/githubService";

export default function GitHubSignInButton() {
  const [profile, setProfile] = useState<any>(null);

  const loadProfile = async () => {
    try {
      const resp = await fetch("/api/github/me");
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

  const signIn = () => githubService.signIn();
  const signOut = async () => {
    await githubService.signOut();
    setProfile(null);
  };

  if (profile) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="h-8 w-8 rounded-full"
        />
        <div className="font-mono text-sm">{profile.login}</div>
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
    <button onClick={signIn} className="px-4 py-2 bg-black text-white rounded">
      Sign in with GitHub
    </button>
  );
}

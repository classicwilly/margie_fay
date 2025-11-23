import React, { useEffect, useState } from 'react';

export default function GoogleSignInButton() {
  const [profile, setProfile] = useState<any>(null);

  const loadProfile = async () => {
    try {
      const resp = await fetch('/api/google/me');
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

  useEffect(() => { loadProfile(); }, []);

  const signIn = () => {
    // Redirect to server-side auth route
    window.location.href = '/api/google/auth';
  };

  const signOut = async () => {
    await fetch('/api/google/logout', { method: 'POST' });
    setProfile(null);
  };

  if (profile) {
    return (
      <div className="flex items-center gap-3">
        <img src={profile.picture} alt={profile.name} className="h-8 w-8 rounded-full" />
        <div className="font-mono text-sm">{profile.name}</div>
        <button onClick={signOut} className="ml-2 px-2 py-1 text-xs bg-surface-700 rounded">Sign out</button>
      </div>
    );
  }

  return (
    <button onClick={signIn} className="px-4 py-2 bg-accent-blue text-white rounded">Sign in with Google</button>
  );
}

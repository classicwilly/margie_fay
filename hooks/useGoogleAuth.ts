import { useState, useEffect, useCallback } from "react";
// import { googleWorkspaceService } from "../src/services/googleWorkspaceService"; // unused - server-side OAuth handled via /api

declare global {
  interface Window {
    google: any;
  }
}

export interface GoogleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    name: string;
    email: string;
    picture?: string;
  } | null;
  error: string | null;
}

export const useGoogleAuth = () => {
  const [authState, setAuthState] = useState<GoogleAuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Instead of using client-side OAuth, test server-side OAuth session
    (async () => {
      try {
        const res = await fetch("/api/google/me");
        if (!res.ok) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return;
        }
        const data = await res.json();
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: {
            name: data.profile.name,
            email: data.profile.email,
            picture: data.profile.picture,
          },
          error: null,
        });
      } catch (err) {
        console.warn("useGoogleAuth: me fetch failed", err);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    })();
  }, []);

  const signIn = useCallback(() => {
    // Server-side OAuth redirect for full Google Workspace permissions
    window.location.href = "/api/google/auth";
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/google/logout", { method: "POST" });
    } catch (err) {
      console.warn("logout failed", err);
    }
    setAccessToken(null);
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
  }, []);

  return {
    ...authState,
    accessToken,
    signIn,
    signOut,
  };
};

import { useState, useEffect, useCallback } from "react";
import { googleWorkspaceService } from "../src/services/googleWorkspaceService";

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
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleAuth();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.head.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Check if user is already signed in
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        });
      } catch (error) {
        console.error("Error initializing Google Auth:", error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to initialize Google authentication",
        }));
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        const token = response.credential;

        // Decode JWT to get user info
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        };

        // Set access token for API calls
        setAccessToken(token);
        googleWorkspaceService.setAccessToken(token);

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user,
          error: null,
        });
      } catch (error) {
        console.error("Error handling credential response:", error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to authenticate with Google",
        }));
      }
    };

    loadGoogleScript();
  }, []);

  const signIn = useCallback(() => {
    if (window.google?.accounts?.id) {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      window.google.accounts.id.prompt();
    } else {
      setAuthState((prev) => ({
        ...prev,
        error: "Google authentication not initialized",
      }));
    }
  }, []);

  const signOut = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.revoke(accessToken, () => {
        setAccessToken(null);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      });
    }
  }, [accessToken]);

  return {
    ...authState,
    accessToken,
    signIn,
    signOut,
  };
};

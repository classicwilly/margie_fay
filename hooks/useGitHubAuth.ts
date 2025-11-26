import { useState, useEffect, useCallback } from "react";
import { githubService } from "../src/services/githubService";

export interface GitHubAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
}

export const useGitHubAuth = () => {
  const [authState, setAuthState] = useState<GitHubAuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const profile = await githubService.getProfile();
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: profile,
          error: null,
        });
      } catch (e) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      }
    })();
  }, []);

  const signIn = useCallback(() => githubService.signIn(), []);
  const signOut = useCallback(async () => {
    await githubService.signOut();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
  }, []);

  return {
    ...authState,
    signIn,
    signOut,
  };
};

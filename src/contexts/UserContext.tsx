import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, FC } from "react";

interface User {
  id: string;
  roles: string[];
  username?: string;
}

interface UserContextType {
  user: User | null;
  login: (id: string, roles: string[], username?: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // In a real app, you'd check for an existing session/token here
    // For this demo, we'll start as logged out.
  }, []);

  const login = (id: string, roles: string[], username?: string) => {
    setUser({ id, roles, username });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserContext };

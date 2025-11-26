import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
} from "react";

interface Flags {
  aiEnabled: boolean;
}

const DEFAULTS: Flags = {
  aiEnabled: true,
};

const FeatureFlagsContext = createContext<{
  flags: Flags;
  setFlag: (k: keyof Flags, v: any) => void;
}>({ flags: DEFAULTS, setFlag: () => {} });

export const FeatureFlagsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Read persisted user-level overrides from localStorage for now
  const [flags, setFlags] = useState<Flags>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("wonky_flags");
        if (raw) {
          return { ...DEFAULTS, ...JSON.parse(raw) };
        }
      }
    } catch (e) {
      console.warn("Error reading wonky_flags", e);
    }
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("wonky_flags", JSON.stringify(flags));
      }
    } catch (e) {
      // ignore
    }
  }, [flags]);

  const setFlag = (k: keyof Flags, v: any) => {
    setFlags((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
export const useAIEnabled = () => useFeatureFlags().flags.aiEnabled;

export default FeatureFlagsContext;

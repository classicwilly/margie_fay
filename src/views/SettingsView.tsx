import { useState, type FC } from "react";
import { useAppState } from "@contexts/AppStateContext";
import { getAllModules } from "../module_registry";
import DiscordAdminSettings from "../components/DiscordAdminSettings";
import { useUser } from "../contexts/UserContext";

const DEFAULT_PERSONAS = ["Grandma", "Grandpa", "Bob", "Marge"];

const SettingsView: FC = () => {
  const { appState, dispatch, getPersonaDisplayName } = useAppState();
  const initialOverrides = appState?.personaOverrides || {};
  const [overrides, setOverrides] = useState<Record<string, string>>({
    ...initialOverrides,
  });
  const { user } = useUser();
  const isAdmin = !!user?.roles?.includes("admin");

  const handleChange = (key: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const saveOverrides = () => {
    // Dispatch each override as a separate action for simplicity
    DEFAULT_PERSONAS.forEach((p) => {
      const v = (overrides[p] || "").trim();
      dispatch({ type: "SET_PERSONA_OVERRIDE", payload: { key: p, value: v } });
    });
    // Ideally persist to remote store here (e.g., Firestore) — TODO
    alert("Persona display names saved");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <p className="text-sm text-text-muted">
        Customize persona display names for privacy and personalization.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {DEFAULT_PERSONAS.map((p) => (
          <div
            key={p}
            className="flex items-center gap-3 bg-surface-800 px-4 py-3 rounded-md"
          >
            <label className="min-w-[130px] text-sm text-text-muted">{p}</label>
            <input
              data-testid={`persona-override-${p}`}
              className="flex-1 px-3 py-2 rounded bg-background-dark text-text-light"
              value={overrides[p] || ""}
              placeholder={`Override name for ${p} (leave empty to use default)`}
              onChange={(e) => handleChange(p, e.target.value)}
            />
            <div className="text-xs text-text-muted font-mono">
              {getPersonaDisplayName?.(p) || p}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold">Modules</h3>
        <p className="text-sm text-text-muted">
          Enable or disable modules for your account.
        </p>
        <div className="mt-2 grid gap-3">
          {getAllModules().map((mod) => {
            const enabled =
              (appState?.moduleStates || {})[mod.id] ??
              !!mod.isEnabledByDefault;
            return (
              <div
                key={mod.id}
                className="flex items-center gap-3 px-4 py-2 bg-surface-800 rounded-md"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {mod.name || mod.id}
                  </div>
                  <div className="text-xs text-text-muted">{mod.id}</div>
                </div>
                <label className="switch">
                  <input
                    aria-label={`Toggle module ${mod.name || mod.id}`}
                    data-testid={`toggle-module-${mod.id}`}
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => {
                      dispatch({
                        type: "SET_MODULE_STATE",
                        payload: { id: mod.id, enabled: e.target.checked },
                      });
                    }}
                  />
                  <span className="slider" />
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        <button
          data-testid="save-persona-overrides"
          onClick={saveOverrides}
          className="px-4 py-2 bg-accent-teal rounded text-white font-bold"
        >
          Save
        </button>
      </div>
      <DiscordAdminSettings isAdmin={isAdmin} />
    </div>
  );
};

export default SettingsView;

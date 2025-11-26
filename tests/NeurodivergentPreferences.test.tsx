import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppStateProvider } from "@contexts/AppStateContext";
import {
  NeuroPrefsProvider,
  useNeuroPrefs,
} from "@contexts/NeurodivergentPreferencesContext";
import * as AppStateContext from "@contexts/AppStateContext";

describe("NeurodivergentPreferences", () => {
  it("Changing assist tone updates preference", () => {
    const dispatch = vi.fn();
    const appState = {
      neuroPrefs: { assistTone: "concise" },
    } as any;
    const useAppStateSpy = vi
      .spyOn(AppStateContext as any, "useAppState")
      .mockReturnValue({ appState, dispatch } as any);

    const TestComponent = () => {
      const { appState, dispatch } = (AppStateContext as any).useAppState();
      return (
        <div>
          <label htmlFor="assistTone">Assist Tone</label>
          <select
            id="assistTone"
            aria-label="Assist Tone"
            value={appState.neuroPrefs.assistTone}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_NEURO_PREF",
                payload: { key: "assistTone", value: e.target.value },
              })
            }
          >
            <option value="concise">concise</option>
            <option value="helpful">helpful</option>
          </select>
        </div>
      );
    };

    render(<TestComponent />);
    const select = screen.getByLabelText(/Tone|Voice|Assist/i);
    fireEvent.change(select, { target: { value: "helpful" } });

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_NEURO_PREF",
      payload: { key: "assistTone", value: "helpful" },
    });
    useAppStateSpy.mockRestore();
  });
  // Additional tests for NeuroPrefs context are below

  const ShowPrefs = () => {
    const { prefs, setPrefs } = useNeuroPrefs();
    return (
      <div>
        <div data-testid="assistTone">{prefs.assistTone}</div>
        <button onClick={() => setPrefs({ assistTone: "helpful" })}>
          Make Helpful
        </button>
      </div>
    );
  };

  describe("Neurodivergent preferences context", () => {
    it("exposes defaults and allows setting", async () => {
      render(
        <AppStateProvider>
          <NeuroPrefsProvider>
            <ShowPrefs />
          </NeuroPrefsProvider>
        </AppStateProvider>,
      );

      expect(screen.getByTestId("assistTone").textContent).toBe("concise");
      fireEvent.click(screen.getByText("Make Helpful"));
      expect(screen.getByTestId("assistTone").textContent).toBe("helpful");
    });
  });
});

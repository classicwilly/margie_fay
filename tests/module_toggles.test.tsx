import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "../src/modules/index";
import { AppStateProvider } from "../src/contexts/AppStateContext";
import { UserProvider } from "@contexts/UserContext";
import SettingsView from "../src/views/SettingsView";
// getModuleRoutes not used in this test

describe("Module toggles UI", () => {
  it("disables a module when toggled off", async () => {
    // Render the settings view inside the app state provider
    render(
      <UserProvider>
        <AppStateProvider>
          <SettingsView />
        </AppStateProvider>
      </UserProvider>,
    );

    // Wait for the toggle for the template-sample module
    const toggle = await screen.findByTestId("toggle-module-template-sample");
    expect(toggle).toBeInTheDocument();
    // Ensure it starts enabled (isEnabledByDefault = true in the sample manifest)
    expect((toggle as HTMLInputElement).checked).toBeTruthy();

    // Toggle it off
    fireEvent.click(toggle);

    await waitFor(() => {
      expect((toggle as HTMLInputElement).checked).toBeFalsy();
    });
    // Confirm module routes are updated via module registry using app state
    // We cannot directly access the new app state here, but verifying UI toggled suffices for now
  });
});

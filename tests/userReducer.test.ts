import { userReducer } from "@contexts/userReducer";
import { defaultUserState } from "../defaultStates";

describe("userReducer - context restore", () => {
  test("CONFIRM_VIEW_CHANGE applies saved context view and clears savedContext/modal", () => {
    const initial = { ...defaultUserState } as any;
    initial.savedContext = { view: "workshop", dashboardType: "william" };
    initial.isContextRestoreModalOpen = true;
    // initial view is not cockpit, ensure change observed
    initial.view = "dashboard";
    const res = userReducer(initial, { type: "CONFIRM_VIEW_CHANGE" } as any);
    expect(res.view).toBe("workshop");
    expect(res.savedContext).toBeNull();
    expect(res.isContextRestoreModalOpen).toBe(false);
  });
});

import { describe, it, expect, beforeAll } from "vitest";
import {
  registerModule,
  getEnabledModules,
  getModuleRoutes,
  getModuleReducers,
  getModuleDefaultStates,
} from "../src/module_registry";
import templateManifest from "../src/modules/template_sample/index";

describe("ModuleManager basic usage", () => {
  beforeAll(() => {
    // Ensure idempotent registration in test runs
    registerModule(templateManifest as any);
  });
  it("should have the template module as enabled", () => {
    const enabled = getEnabledModules();
    expect(enabled.some((m) => m.id === "template-sample")).toBe(true);
  });
  it("should expose the module route", () => {
    const routes = getModuleRoutes();
    expect(routes.some((r) => r.path === "/template-sample")).toBe(true);
  });
  it("should expose a reducer keyed by module id", () => {
    const reducers = getModuleReducers();
    expect(reducers["template-sample"]).toBeDefined();
  });
  it("should expose default state for module", () => {
    const states = getModuleDefaultStates();
    expect(states["template-sample"]).toBeDefined();
    expect(states["template-sample"]).toHaveProperty("counter");
  });
});

import { exportSops, importSops } from "../src/utils/importExport";

describe("importExport utilities", () => {
  it("exports and imports sop JSON correctly", () => {
    const sample = [{ id: "a", title: "A SOP", steps: ["one"] }];
    const out = exportSops(sample as any);
    expect(typeof out).toBe("string");

    const parsed = importSops(out);
    expect(parsed.sops.length).toBe(1);
    expect(parsed.sops[0].title).toBe("A SOP");
  });

  it("throws for invalid payloads", () => {
    expect(() => importSops("not json")).toThrow();
    expect(() => importSops(JSON.stringify({ wrong: true }))).toThrow();
  });
});

const { scrubPII, hashUserId } = require("../pii_sanitizer");

describe("scrubPII", () => {
  it("removes emails", () => {
    const result = scrubPII("Reach me at alice@example.com");
    expect(result.text).not.toMatch(/@/);
    expect(result.found).toContain("email");
  });

  it("removes phone numbers", () => {
    const result = scrubPII("Call +1 555-123-4567 for details");
    expect(result.text).not.toMatch(/555/);
    expect(result.found).toContain("phone");
  });

  it("masks ssn", () => {
    const result = scrubPII("My SSN is 123-45-6789");
    expect(result.text).not.toContain("123-45-6789");
    expect(result.found).toContain("ssn");
  });

  it("hashes user id consistently", () => {
    const h1 = hashUserId("user-1");
    const h2 = hashUserId("user-1");
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64); // SHA256 hex length
  });
});

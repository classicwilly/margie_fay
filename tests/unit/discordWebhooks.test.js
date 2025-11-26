import { describe, it, expect } from "vitest";
import nacl from "tweetnacl";
import { genKeyPair } from "../utils/discordTestHelpers";
import { verifyDiscordSignature } from "../../server/discordWebhooks.js";

describe("verifyDiscordSignature", () => {
  it("returns false when publicKey missing", async () => {
    const ok = await verifyDiscordSignature(
      "",
      "sig",
      "123",
      Buffer.from("{}"),
    );
    expect(ok).toBe(false);
  });
  it("returns false for invalid signature", async () => {
    const mockKey = "abcdef";
    const ok = await verifyDiscordSignature(
      mockKey,
      "deadbeef",
      "123",
      Buffer.from("{}"),
    );
    expect(ok).toBe(false);
  });

  it("returns false for truncated signature", async () => {
    const kp = nacl.sign.keyPair();
    const pkHex = Buffer.from(kp.publicKey).toString("hex");
    const timestamp = "1234567890";
    const body = Buffer.from("{}");
    const sig = nacl.sign.detached(
      new Uint8Array(Buffer.concat([Buffer.from(timestamp, "utf8"), body])),
      kp.secretKey,
    );
    const sigHex = Buffer.from(sig).toString("hex");
    const truncated = sigHex.substring(0, sigHex.length - 10); // truncate
    const ok = await verifyDiscordSignature(pkHex, truncated, timestamp, body);
    expect(ok).toBe(false);
  });

  it("returns false for mismatched message", async () => {
    const kp = nacl.sign.keyPair();
    const pkHex = Buffer.from(kp.publicKey).toString("hex");
    const timestamp = "1234567890";
    const bodyA = Buffer.from(JSON.stringify({ a: 1 }));
    const bodyB = Buffer.from(JSON.stringify({ b: 2 }));
    const msg = Buffer.concat([Buffer.from(timestamp, "utf8"), bodyA]);
    const sig = nacl.sign.detached(new Uint8Array(msg), kp.secretKey);
    const sigHex = Buffer.from(sig).toString("hex");
    const ok = await verifyDiscordSignature(pkHex, sigHex, timestamp, bodyB);
    expect(ok).toBe(false);
  });

  it("returns false for invalid public key hex (wrong length)", async () => {
    const kp = genKeyPair();
    const pkHex = "abcd"; // invalid short length
    const timestamp = "1234567890";
    const body = Buffer.from("{}");
    const msg = Buffer.concat([Buffer.from(timestamp, "utf8"), body]);
    const sig = nacl.sign.detached(new Uint8Array(msg), kp.secretKey);
    const sigHex = Buffer.from(sig).toString("hex");
    const ok = await verifyDiscordSignature(pkHex, sigHex, timestamp, body);
    expect(ok).toBe(false);
  });

  it("returns false for non-hex public key", async () => {
    const kp = genKeyPair();
    const pkHex = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
    const timestamp = "1234567890";
    const body = Buffer.from("{}");
    const msg = Buffer.concat([Buffer.from(timestamp, "utf8"), body]);
    const sig = nacl.sign.detached(new Uint8Array(msg), kp.secretKey);
    const sigHex = Buffer.from(sig).toString("hex");
    const ok = await verifyDiscordSignature(pkHex, sigHex, timestamp, body);
    expect(ok).toBe(false);
  });

  it("verifies a valid Ed25519 signature", async () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = Buffer.from(JSON.stringify({ hello: "discord" }));
    const kp = nacl.sign.keyPair();
    const pkHex = Buffer.from(kp.publicKey).toString("hex");
    const msgBytes = Buffer.concat([
      Buffer.from(timestamp, "utf8"),
      Buffer.from(rawBody),
    ]);
    const msgUint8 = new Uint8Array(msgBytes);
    const sigBytes = nacl.sign.detached(msgUint8, kp.secretKey);
    const sigHex = Buffer.from(sigBytes).toString("hex");
    const ok = await verifyDiscordSignature(pkHex, sigHex, timestamp, rawBody);
    expect(ok).toBe(true);
  });
});

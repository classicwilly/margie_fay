import nacl from "tweetnacl";

// Utility to build discord raw message, signature and headers for tests
export function buildSignedDiscordPayload(payload, keyPair, timestamp) {
  const ts = timestamp || Math.floor(Date.now() / 1000).toString();
  const bodyStr =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  const msg = Buffer.concat([Buffer.from(ts, "utf8"), Buffer.from(bodyStr)]);
  const sig = nacl.sign.detached(new Uint8Array(msg), keyPair.secretKey);
  const sigHex = Buffer.from(sig).toString("hex");
  const pkHex = Buffer.from(keyPair.publicKey).toString("hex");
  return { bodyStr, ts, sigHex, pkHex };
}

export function genKeyPair() {
  return nacl.sign.keyPair();
}

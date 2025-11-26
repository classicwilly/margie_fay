import express from "express";
import crypto from "crypto";
import { getPersonaInstruction } from "./personas.js";
// scrubPII is a CommonJS export; import dynamically like server.js to handle both CJS and ESM forms
async function getPiiModule() {
  try {
    const module = await import("../functions/pii_sanitizer.js");
    return (
      (module && (module.scrubPII ? module : module.default)) || {
        scrubPII: (t) => ({ text: t, found: [] }),
      }
    );
  } catch (e) {
    return { scrubPII: (t) => ({ text: t, found: [] }) };
  }
}

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      prompt,
      systemInstruction: clientSystemInstruction,
      personaKey,
      maxTokens,
    } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    // Sanitize prompt unless allowPII explicitly set
    const { allowPII } = req.body || {};
    let sanitized = prompt;
    let found = [];
    if (!allowPII) {
      const piiModule = await getPiiModule();
      const result = piiModule.scrubPII(prompt);
      sanitized = result.text;
      found = result.found;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ error: "Server missing GEMINI_API_KEY" });

    const model =
      process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-09-2025";
    const url = `https://generativeai.googleapis.com/v1/models/${model}:generate`;

    const personaSystemInstruction = personaKey
      ? getPersonaInstruction(personaKey)
      : null;
    const systemInstruction = [
      personaSystemInstruction,
      clientSystemInstruction,
    ]
      .filter(Boolean)
      .join("\n\n");

    const body = {
      prompt: [
        { role: "system", content: systemInstruction || "" },
        { role: "user", content: sanitized },
      ],
      maxOutputTokens: maxTokens || 512,
      temperature: 0.6,
    };

    // Do the external call to Gemini
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return res.json({ ...json, _sanitized: !!found.length });
  } catch (err) {
    console.error("Gemini proxy router error", err);
    return res.status(500).json({ error: "Gemini proxy error" });
  }
});

export default router;

const piiPatterns = [
  { type: "Email", regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  {
    type: "Phone",
    regex: /\b(?:\+?1[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}\b/g,
  },
  {
    type: "API Key",
    regex: /\b(sk-[a-zA-Z0-9]{32,}|AIzaSy[a-zA-Z0-9_-]{33}|api_key|api-key)\b/g,
  },
  {
    type: "Financial Keyword",
    regex:
      /\b(credit card|bank account|ssn|social security|salary|financial|debit card|routing number|password)\b/gi,
  },
  {
    type: "Health Keyword",
    regex:
      /\b(medical|diagnosis|doctor|patient|hospital|prescription|symptoms|medication)\b/gi,
  },
];

export function scanForPII(
  text: string,
): Array<{ type: string; value: string }> {
  const matches: Array<{ type: string; value: string }> = [];
  if (!text) {
    return matches;
  }

  piiPatterns.forEach((pattern) => {
    const result = text.match(pattern.regex);
    if (result) {
      result.forEach((value: string) => {
        matches.push({ type: pattern.type, value });
      });
    }
  });

  // Remove duplicates
  const uniqueMatches = Array.from(
    new Map(matches.map((item) => [item.type + item.value, item])).values(),
  );

  return uniqueMatches;
}

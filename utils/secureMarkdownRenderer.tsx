import type { FC } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

// Suppress automatic header id generation and email/social mangling warnings
marked.setOptions({
  mangle: false,
  headerIds: false,
});

interface Props {
  source?: string;
  content?: string;
}

// Backwards-compatible SecureMarkdown: accepts either `source` or `content`.
export const SecureMarkdown: FC<Props> = ({ source, content }) => {
  // Convert markdown to HTML, then sanitize strict allow-list
  const mdSource = source ?? content ?? "";
  const html = marked.parse(mdSource || "");
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default SecureMarkdown;

export function renderSecureMarkdown(raw: string) {
  const html = marked.parse(raw || "");
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

"use client";

import sanitizeHtml from "sanitize-html";
import ReactMarkdown from "react-markdown";

type PageBodyContentProps = {
  body: string;
  className?: string;
  /** When set, strip a leading markdown "# Title" line if it matches, to avoid duplicating the page H1 */
  pageTitle?: string;
};

function looksLikeHtml(body: string): boolean {
  return body.trimStart().startsWith("<");
}

/** Ensure body has real newlines so markdown paragraphs render (fixes escaped or wrong line endings). */
function normalizeBodyNewlines(body: string): string {
  return body
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\\n/g, "\n");
}

/**
 * Fix known content inconsistencies in API-sourced article bodies:
 * - Normalize "R L Peek Painting" (with errant space) to "RL Peek Painting"
 * - Remove legacy placeholder phrases left over from old content generation
 */
function sanitizeBodyText(body: string): string {
  return body
    .replace(/\bR\s+L\s+Peek\s+Painting\b/g, "RL Peek Painting")
    .replace(/\bWith Our RL Peek Painting Company!?\s*/gi, "")
    .trim();
}

/** If body starts with "# Title" where Title matches pageTitle, remove that line (and following blank) to avoid duplicating the page H1. */
function stripDuplicateLeadingH1(body: string, pageTitle: string): string {
  if (!pageTitle?.trim()) return body;
  const trimmed = body.trimStart();
  const title = pageTitle.trim();
  const match = trimmed.match(/^#\s+(.+?)(\n|$)/);
  if (!match) return body;
  const headingText = match[1].trim();
  if (headingText !== title && !headingText.startsWith(title) && !title.startsWith(headingText)) return body;
  const rest = trimmed.slice(match[0].length).replace(/^\n+/, "").trimStart();
  return rest;
}

export function PageBodyContent({ body, className, pageTitle }: PageBodyContentProps) {
  if (!body) return null;

  const cleaned = sanitizeBodyText(body);

  if (looksLikeHtml(cleaned)) {
    const sanitized = sanitizeHtml(cleaned, {
      allowedTags: [
        "p", "br", "strong", "em", "u", "s", "code", "pre",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "blockquote", "hr",
        "a", "img",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
        img: ["src", "alt"],
      },
    });
    const htmlProseClass =
      `${className ?? ""} ` +
      "[&_p]:mb-4 [&_p:last-child]:mb-0 " +
      "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 first:[&_h1]:mt-0 " +
      "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 " +
      "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 " +
      "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 " +
      "[&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600 " +
      "[&_hr]:my-6 [&_a]:text-sky-600 [&_a]:underline hover:[&_a]:no-underline [&_strong]:font-semibold";
    return (
      <div
        className={htmlProseClass.trim()}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  let normalized = normalizeBodyNewlines(cleaned);
  if (pageTitle) normalized = stripDuplicateLeadingH1(normalized, pageTitle);
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
          h2: ({ children }) => (
            <h2 className="mt-8 mb-3 text-xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-lg font-semibold">{children}</h3>
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}

import React from "react";
import { localize } from "./routes.js";

// A deliberately small markdown renderer for the article files:
// headings, paragraphs, unordered lists, **bold** and [links](url).

function href(url, lang) {
  const sibling = url.match(/^\.\/([\w-]+)\.md$/);
  if (sibling) return localize(lang, "/blog/" + sibling[1]);
  if (url.startsWith("/")) return localize(lang, url);
  return url;
}

function inline(text, lang, keyBase) {
  const out = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let match;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    if (match[1] !== undefined) out.push(<strong key={keyBase + i++}>{inline(match[1], lang, keyBase + i + "-")}</strong>);
    else {
      const external = /^https?:/.test(match[3]);
      out.push(
        <a key={keyBase + i++} href={href(match[3], lang)} {...(external ? { rel: "noopener" } : {})}>
          {match[2]}
        </a>
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, lang }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return blocks.map((block, b) => {
    const lines = block.trim().split("\n");
    if (!lines[0]) return null;
    const heading = lines[0].match(/^(#{2,4})\s+(.*)$/);
    if (heading && lines.length === 1) {
      const Tag = "h" + heading[1].length;
      return <Tag key={b}>{inline(heading[2], lang, b + "h")}</Tag>;
    }
    for (const [pattern, Tag] of [
      [/^[-*]\s+/, "ul"],
      [/^\d+\.\s+/, "ol"],
    ]) {
      if (lines.every((l) => pattern.test(l))) {
        return (
          <Tag key={b}>
            {lines.map((l, i) => (
              <li key={i}>{inline(l.replace(pattern, ""), lang, `${b}-${i}-`)}</li>
            ))}
          </Tag>
        );
      }
    }
    return <p key={b}>{inline(lines.join(" "), lang, b + "p")}</p>;
  });
}

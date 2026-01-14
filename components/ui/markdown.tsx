// components/Markdown.tsx
import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  children: string;
};

export function Markdown({ children }: Props) {
  return (
    <article className="prose prose-slate max-w-none">
      <ReactMarkdown>{children}</ReactMarkdown>
    </article>
  );
}

// components/Markdown.tsx
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl capitalize font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl capitalize font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg capitalize font-semibold">{children}</h3>
  ),
  ul: ({ children }) => <ul className="list-disc ml-5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal ml-5">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  p: ({ children }) => <p className="mb-2">{children}</p>,
};

type Props = {
  children: string;
};

export const Markdown = ({ children }: Props) => {
  return (
    <ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown>
  );
};

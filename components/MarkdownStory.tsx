import type { FC } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownStoryProps {
  content: string;
}

const MarkdownStory: FC<MarkdownStoryProps> = ({ content }) => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownStory;

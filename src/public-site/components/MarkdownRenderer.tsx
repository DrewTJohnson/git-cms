import { createMemo } from "solid-js";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
  content: string;
  class?: string;
}

export default function MarkdownRenderer(props: Props) {
  const html = createMemo(() => {
    const raw = marked.parse(props.content) as string;
    return DOMPurify.sanitize(raw);
  });

  return (
    <div
      class={`prose ${props.class ?? ""}`}
      innerHTML={html()}
    />
  );
}

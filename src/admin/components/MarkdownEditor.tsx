import {
  onMount,
  onCleanup,
  createEffect,
  createSignal,
  createMemo,
} from "solid-js";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
  value: string;
  onChange: (value: string) => void;
  class?: string;
}

export default function MarkdownEditor(props: Props) {
  let editorContainer!: HTMLDivElement;
  let view: EditorView | undefined;
  const [activeTab, setActiveTab] = createSignal<"editor" | "preview">(
    "editor"
  );

  const previewHtml = createMemo(() => {
    const html = marked.parse(props.value) as string;
    return DOMPurify.sanitize(html);
  });

  onMount(() => {
    const state = EditorState.create({
      doc: props.value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            props.onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { height: "100%", fontSize: "14px" },
          ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-mono)" },
        }),
      ],
    });

    view = new EditorView({ state, parent: editorContainer });
  });

  // Sync external value changes into the editor (e.g., when page loads)
  createEffect(() => {
    const newVal = props.value;
    if (view && view.state.doc.toString() !== newVal) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newVal,
        },
      });
    }
  });

  onCleanup(() => {
    view?.destroy();
  });

  return (
    <div class={`md-editor ${props.class ?? ""}`}>
      <div class="md-editor__tabs">
        <button
          class={`md-editor__tab ${activeTab() === "editor" ? "md-editor__tab--active" : ""}`}
          onClick={() => setActiveTab("editor")}
          type="button"
        >
          Edit
        </button>
        <button
          class={`md-editor__tab ${activeTab() === "preview" ? "md-editor__tab--active" : ""}`}
          onClick={() => setActiveTab("preview")}
          type="button"
        >
          Preview
        </button>
      </div>

      <div class="md-editor__body">
        <div
          class="md-editor__cm-container"
          style={{ display: activeTab() === "editor" ? "flex" : "none" }}
          ref={editorContainer}
        />
        <div
          class="md-editor__preview prose"
          style={{ display: activeTab() === "preview" ? "block" : "none" }}
          innerHTML={previewHtml()}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  value: string;
  onChange: (nextValue: string) => void;
  ariaLabel: string;
};

const isSameHtml = (a: string, b: string) => a.trim() === b.trim();

export default function RichTextEditor({
  value,
  onChange,
  ariaLabel,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "admin-wysiwyg__content",
        "aria-label": ariaLabel,
      },
    },
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    const nextHtml = value || "<p></p>";

    if (!isSameHtml(currentHtml, nextHtml)) {
      editor.commands.setContent(nextHtml, false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="admin-wysiwyg">
      <div className="admin-wysiwyg__toolbar" role="toolbar">
        <button
          className={`admin-wysiwyg__button${
            editor.isActive("bold") ? " is-active" : ""
          }`}
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-pressed={editor.isActive("bold")}
        >
          Bold
        </button>
        <button
          className={`admin-wysiwyg__button${
            editor.isActive("italic") ? " is-active" : ""
          }`}
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-pressed={editor.isActive("italic")}
        >
          Italic
        </button>
        <button
          className={`admin-wysiwyg__button${
            editor.isActive("strike") ? " is-active" : ""
          }`}
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-pressed={editor.isActive("strike")}
        >
          Strike
        </button>
        <button
          className={`admin-wysiwyg__button${
            editor.isActive("bulletList") ? " is-active" : ""
          }`}
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-pressed={editor.isActive("bulletList")}
        >
          Bullets
        </button>
        <button
          className={`admin-wysiwyg__button${
            editor.isActive("orderedList") ? " is-active" : ""
          }`}
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-pressed={editor.isActive("orderedList")}
        >
          Numbered
        </button>
        <button
          className="admin-wysiwyg__button"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </button>
        <button
          className="admin-wysiwyg__button"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

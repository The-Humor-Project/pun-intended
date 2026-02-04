"use client";

import {useEffect, useId, useMemo, useState} from "react";

import {renderMarkdown} from "@/app/lib/markdown";

type MarkdownEditorProps = {
  value: string;
  onChange: (nextValue: string) => void;
  ariaLabel: string;
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

export default function MarkdownEditor({
  value,
  onChange,
  ariaLabel,
}: MarkdownEditorProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  const rendered = useMemo(() => renderMarkdown(value), [value]);
  const hasContent = useMemo(
    () => stripHtml(rendered).length > 0,
    [rendered],
  );

  useEffect(() => {
    if (!isPreviewOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

  return (
    <div className="admin-markdown">
      <textarea
        className="admin-textarea admin-markdown__textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
      />
      <div className="admin-markdown__actions">
        <button
          className="admin-button admin-button--ghost"
          type="button"
          onClick={() => setIsPreviewOpen(true)}
        >
          Preview
        </button>
      </div>
      {isPreviewOpen && (
        <div
          className="admin-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="admin-preview-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-preview-modal__header">
              <div>
                <h3 id={titleId} className="admin-preview-modal__title">
                  Markdown Preview
                </h3>
                <p
                  id={descriptionId}
                  className="admin-preview-modal__subtitle"
                >
                  This is how the content will appear to students.
                </p>
              </div>
              <button
                className="admin-button"
                type="button"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </button>
            </div>
            <div
              className="admin-preview-modal__content assignment-body"
              dangerouslySetInnerHTML={{
                __html: hasContent
                  ? rendered
                  : "<p class=\"admin-preview-modal__empty\">Nothing to preview yet.</p>",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

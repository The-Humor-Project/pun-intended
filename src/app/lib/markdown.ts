import MarkdownIt from "markdown-it";

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

export const renderMarkdown = (value: string) => {
  if (!value) {
    return "";
  }

  return markdown.render(value);
};

export const hasMarkdownContent = (value: string) => {
  if (!value) {
    return false;
  }

  return stripHtml(renderMarkdown(value)).length > 0;
};

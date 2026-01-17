export const decodeHtmlEntities = (value: string) => {
  const unescaped = value.replace(/&amp;/g, "&");

  return unescaped
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
};

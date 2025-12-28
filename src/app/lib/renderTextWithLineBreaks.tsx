import { Fragment } from "react";

export const renderTextWithLineBreaks = (text: string) => {
  const lines = text.split("\n");

  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
};

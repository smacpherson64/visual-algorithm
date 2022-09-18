import * as React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";
import { classNames } from "./utils";
import "./Code.css";

export default function Code({
  children,
  language = "typescript",
  highlightedLines = []
}: {
  children: string;
  language?: Language;
  highlightedLines?: number[];
}) {
  return (
    <Highlight
      {...defaultProps}
      theme={vsDark}
      code={children}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={classNames(className, "code p-4 overflow-scroll")}
          style={{ ...style }}
          data-language="typescript"
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i });

            const finalLineProps = {
              ...lineProps,
              className: classNames(
                lineProps.className,
                "line block",
                highlightedLines.includes(i) ? "bg-gray-700" : ""
              )
            };

            return (
              <code {...getLineProps({ line, key: i })} {...finalLineProps}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </code>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

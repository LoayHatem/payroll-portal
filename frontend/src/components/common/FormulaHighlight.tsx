import React from "react";
import { Language, Highlight, themes } from "prism-react-renderer";

interface FormulaHighlightProps {
  formula: string;
  language?: Language;
}

export const FormulaHighlight: React.FC<FormulaHighlightProps> = ({ formula, language = "javascript" }) => (
  <Highlight
    theme={themes.oneDark}
    code={formula}
    language={language}
  >
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <div
        className={`${className} overflow-auto p-4 rounded-md max-w-[100%] font-mono`}
        style={{
          ...style,
        }}
      >
        {tokens.map((line, i) => (
          <div
            key={i}
            {...getLineProps({ line, key: i })}
          >
            {line.map((token, key) => (
              <span
                key={key}
                {...getTokenProps({ token, key })}
              />
            ))}
          </div>
        ))}
      </div>
    )}
  </Highlight>
);

import { ITextRenderProps } from "./TextConfig";
import { Section } from "../Components/Section";
import { formatTestSelector } from "@znode/utils/common";

export function TextRender({ align, color, text, size, padding }: ITextRenderProps) {
  return (
    <Section padding={padding}>
      <span
        style={{
          color: color === "default" ? "inherit" : "var(--puck-color-grey-05)",
          display: "flex",
          textAlign: align,
          width: "100%",
          fontSize: size === "m" ? "20px" : "16px",
          fontWeight: 300,
          marginLeft: "auto",
          marginRight: "auto",
          justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          whiteSpace: "pre-wrap",
        }}
        data-test-selector={formatTestSelector("spn", `${text}`)}
      >
        {text}
      </span>
    </Section>
  );
}

import React from "react";

// ** Override and implement your custom theme Text
export function Text({
  align,
  color,
  text,
  size,
  padding,
  maxWidth,
  dataTestSelector,
}: {
  align?: "left" | "center" | "right";
  color: string;
  text?: string;
  size?: string;
  padding?: string;
  maxWidth?: string;
  dataTestSelector?: string;
}) {
  return (
    <div
      className="p-4"
      style={{
        paddingTop: padding,
        paddingBottom: padding,
      }}
    >
      <span
        style={{
          color: color === "default" ? "inherit" : "var(--puck-color-grey-05)",
          display: "flex",
          width: "100%",
          textAlign: align,
          fontSize: size === "m" ? "20px" : "16px",
          fontWeight: 300,
          maxWidth,
          marginLeft: "auto",
          marginRight: "auto",
          justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        }}
        data-test-selector={dataTestSelector}
      >
        {text}
      </span>
    </div>
  );
}

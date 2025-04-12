import { IHeadingProps, IHeadingRenderProps } from "./HeadingConfig";

import { Section } from "../Components/Section";
import { formatTestSelector } from "@znode/utils/common";

export function HeadingRender({ align, text, size, level, padding, margin, background, border, textColor }: IHeadingRenderProps) {
  const getStyle = () => ({
    textAlign: align,
    paddingTop: `${padding?.top || 0}px`,
    paddingRight: `${padding?.right || 0}px`,
    paddingBottom: `${padding?.bottom || 0}px`,
    paddingLeft: `${padding?.left || 0}px`,
    marginTop: `${margin?.top || 0}px`,
    marginRight: `${margin?.right || 0}px`,
    marginBottom: `${margin?.bottom || 0}px`,
    marginLeft: `${margin?.left || 0}px`,
    backgroundColor: background || "transparent",
    borderWidth: `${border?.width || 0}px`,
    borderStyle: border?.style || "solid",
    borderColor: border?.color || "transparent",
    borderRadius: border?.borderRadius || "transparent",
    color: textColor || "black",
  });

  return (
    <Section>
      <div style={getStyle()}>
        <Heading size={size} rank={level as any} dataTestSelector={formatTestSelector("hdg", `${text}`)}>
          {text}
        </Heading>
      </div>
    </Section>
  );
}

const getClassName = (size: string): string => {
  let sizes: { [key in typeof size]: string } = {
    xs: "text-xs",
    s: "text-sm",
    m: "text-[16px]",
    l: "text-lg",
    xl: "text-xl",
    xxl: "text-2xl",
    xxxl: "text-3xl",
  };
  return sizes[size] + " font-bold";
};

function Heading({ children, rank, size = "m", dataTestSelector }: IHeadingProps) {
  const Tag: any = rank ? `h${rank}` : "span";
  return (
    <Tag className={getClassName(size)} data-test-selector={dataTestSelector}>
      {children}
    </Tag>
  );
}

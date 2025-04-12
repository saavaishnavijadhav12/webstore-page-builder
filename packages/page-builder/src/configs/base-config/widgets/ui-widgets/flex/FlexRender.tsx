import { DropZone } from "@measured/puck";
import type { IFlexRenderProps } from "./FlexConfig";
import { Section } from "../Components/Section";

export function FlexRender({ block, align, margin, padding, border, image, height, maxWidth, hasDropZoneDisabled = false }: IFlexRenderProps) {
  const alignmentClasses: Record<string, string> = {
    left: "ml-0 mr-auto",
    center: "mx-auto",
    right: "ml-auto mr-0",
  };

  const getAlignmentClass = () => {
    return `${alignmentClasses[align]}`;
  };

  const getWidthStyle = () => (block === "full" ? { width: "100%" } : { width: "100%", maxWidth: `${maxWidth}px` });

  const filterDefaults = (value: string | number, defaultValue: string | number) => {
    return value !== defaultValue ? `${value}px` : undefined;
  };

  const getAdjustedMargin = () => ({
    marginTop: filterDefaults(margin.top, "0"),
    marginRight: filterDefaults(margin.right, "0"),
    marginLeft: filterDefaults(margin.left, "0"),
  });

  const getAdjustedPadding = () => ({
    paddingTop: filterDefaults(padding.top, "0"),
    paddingRight: filterDefaults(padding.right, "0"),
    paddingBottom: filterDefaults(padding.bottom, "0"),
    paddingLeft: filterDefaults(padding.left, "0"),
  });

  const getAdjustedBorder = () => ({
    borderWidth: filterDefaults(border.width, "0"),
    borderStyle: border.style !== "solid" ? border.style : undefined,
    borderColor: border.color !== "black" ? border.color : undefined,
    borderRadius: border.borderRadius !== 0 ? `${border.borderRadius}px` : undefined,
  });

  const getComputedHeight = () => {
    if (typeof height === "number" && height > 0) {
      return `${height}px`;
    }
    return height === "auto" || (typeof height === "number" && height === 0) ? "" : undefined;
  };

  const getBackgroundStyles = () => {
    if (image.src) {
      return {
        backgroundImage: `url(${image.src})`,
        backgroundSize: image.backgroundSize !== "cover" ? image.backgroundSize : undefined,
        backgroundPosition: image.backgroundPosition !== "center" ? image.backgroundPosition : undefined,
        backgroundRepeat: image.backgroundRepeat !== "repeat" ? image.backgroundRepeat : undefined,
        backgroundClip: "padding-box",
      };
    }
    return {};
  };

  // Prepare final style
  const getStyle = () => ({
    ...getAdjustedMargin(),
    ...getAdjustedPadding(),
    ...getAdjustedBorder(),
    height: getComputedHeight(),
    ...getWidthStyle(),
    ...getBackgroundStyles(),
  });

  const dropZoneDisabled = hasDropZoneDisabled ? { allow: [] } : {};

  return (
    <Section>
      <div className={getAlignmentClass()} style={getStyle()}>
        <DropZone zone="flex" {...dropZoneDisabled} />
      </div>
    </Section>
  );
}

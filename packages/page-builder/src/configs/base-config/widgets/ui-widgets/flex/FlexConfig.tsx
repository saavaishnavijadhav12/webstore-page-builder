import { AssetsGallery } from "../../../../../component/assets-gallery";
import { ColorPicker } from "@znode/base-components/common/color-picker";
import { ComponentConfig } from "@measured/puck";
import { FlexRender } from "./FlexRender";
import { IRenderProps } from "../../../../../types/page-builder";
import { Images } from "lucide-react";
import { MediaPopup } from "../../../../../component/media-popup";
import { MEDIA } from "@znode/constants/images";
interface IMarginPadding {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

interface IBorder {
  width: string;
  color: string;
  style: "solid" | "dotted" | "dashed";
  borderRadius: number;
}

interface IImageConfig {
  src: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
}
export interface IFlexConfig {
  block: "full" | "box";
  align: "center" | "left" | "right";
  height: string;
  margin: IMarginPadding;
  padding: IMarginPadding;
  border: IBorder;
  image: IImageConfig;
  maxWidth?: number;
  hasDropZoneDisabled?: boolean;
}

export type IFlexRenderProps = IFlexConfig & IRenderProps;

export const FlexConfig: ComponentConfig<IFlexConfig> = {
  fields: {
    block: {
      label: "Block",
      type: "radio",
      options: [
        { label: "Full", value: "full" },
        { label: "Box", value: "box" },
      ],
    },
    align: {
      label: "Align",
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    maxWidth: {
      label: "Max Width",
      type: "number",
    },
    height: {
      label: "Height",
      type: "number",
      min: 0,
      max: 2400,
    },
    image: {
      label: "Background Image",
      type: "object",
      objectFields: {
        src: {
          label: "Select",
          type: "custom",
          render: ({ onChange }) => {
            return <MediaPopup mediaType={MEDIA.REQUIRED_EXTENSION} onChange={onChange} header="Select Image" Component={AssetsGallery} ButtonIcon={Images} />;
          },
        },
        backgroundSize: {
          label: "Background Size",
          type: "radio",
          options: [
            { label: "Cover", value: "cover" },
            { label: "Contain", value: "contain" },
            { label: "Auto", value: "auto" },
          ],
        },
        backgroundPosition: {
          label: "Background Position",
          type: "select",
          options: [
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
            { label: "Bottom", value: "bottom" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
        backgroundRepeat: {
          label: "Background Repeat",
          type: "select",
          options: [
            { label: "No Repeat", value: "no-repeat" },
            { label: "Repeat", value: "repeat" },
            { label: "Repeat X", value: "repeat-x" },
            { label: "Repeat Y", value: "repeat-y" },
          ],
        },
      },
    },
    margin: {
      label: "Margin",
      type: "object",
      objectFields: {
        top: {
          label: "Top",
          type: "number",
          min: 0,
          max: 200,
        },
        right: {
          label: "Right",
          type: "number",
          min: 0,
          max: 200,
        },
        bottom: {
          label: "Bottom",
          type: "number",
          min: 0,
          max: 200,
        },
        left: {
          label: "Left",
          type: "number",
          min: 0,
          max: 200,
        },
      },
    },
    padding: {
      label: "Padding",
      type: "object",
      objectFields: {
        top: {
          label: "Top",
          type: "number",
          min: 0,
          max: 200,
        },
        right: {
          label: "Right",
          type: "number",
          min: 0,
          max: 200,
        },
        bottom: {
          label: "Bottom",
          type: "number",
          min: 0,
          max: 200,
        },
        left: {
          label: "Left",
          type: "number",
          min: 0,
          max: 200,
        },
      },
    },
    border: {
      label: "Border",
      type: "object",
      objectFields: {
        width: {
          label: "Width",
          type: "number",
          min: 0,
          max: 2400,
        },
        color: {
          label: "Color",
          type: "custom",
          render: ({ onChange, value }) => {
            return <ColorPicker label="Color" value={value} onChange={(color: string) => onChange(color)} />;
          },
        },
        borderRadius: {
          label: "Border Radius",
          type: "number",
          min: 0,
          max: 100,
        },
        style: {
          label: "Style",
          type: "radio",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dotted", value: "dotted" },
            { label: "Dashed", value: "dashed" },
          ],
        },
      },
    },
  },
  defaultProps: {
    align: "center",
    block: "full",
    maxWidth: 1200,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
    padding: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
    border: {
      width: "0",
      color: "black",
      style: "solid",
      borderRadius: 0,
    },
    height: "auto",
    image: {
      src: "",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
  resolveFields: async (data, { fields }) => {
    if (data.props.block === "full") {
      return {
        ...fields,
        maxWidth: undefined,
      };
    }

    return fields;
  },
  render: (props: IFlexRenderProps) => {
    return <FlexRender {...props} />;
  },
};

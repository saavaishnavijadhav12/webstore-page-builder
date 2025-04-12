import type { ComponentConfig } from "@measured/puck";
import { IRenderProps } from "../../../../../types/page-builder";
import { MediaPopup } from "../../../../../component/media-popup";
import { Images } from "lucide-react";
import { TextImageRender } from "./TextImageRender";
import { AssetsGallery } from "../../../../../component/assets-gallery";
import { MEDIA } from "@znode/constants/images";

export interface ITextImageConfig {
  padding: string;
  margin: string;
  order: "image-first" | "text-first";
  heading: string;
  description: string;
  image: {
    ratio: "small" | "large";
    src: string;
    width: number;
    alt: string;
  };
  button: {
    buttonText: string;
    url: string;
  };
}

export type ITextImageRenderProps = ITextImageConfig & IRenderProps;

export const TextImageConfig: ComponentConfig<ITextImageConfig> = {
  fields: {
    padding: {
      label: "Padding",
      type: "text",
    },
    margin: {
      label: "Margin",
      type: "text",
    },
    heading: {
      label: "Heading",
      type: "text",
    },
    description: {
      label: "Description",
      type: "textarea",
    },

    button: {
      label: "Button",
      type: "object",
      objectFields: {
        buttonText: {
          label: "Button label",
          type: "text",
        },
        url: {
          label: "Button url",
          type: "text",
        },
      },
    },
    order: {
      label: "Layout",
      type: "radio",
      options: [
        { label: "Image first", value: "image-first" },
        { label: "Text first", value: "text-first" },
      ],
    },
    image: {
      label: "Image",
      type: "object",
      objectFields: {
        ratio: {
          label: "Image ratio",
          type: "radio",
          options: [
            { label: "Small", value: "small" },
            { label: "Large", value: "large" },
          ],
        },
        width: {
          type: "number",
          label: "Width",
          min: 0,
          max: 2400,
        },
        alt: {
          type: "text",
          label: "Alt",
        },
        src: {
          label: "Select",
          type: "custom",
          render: ({ onChange }) => {
            return <MediaPopup mediaType={MEDIA.REQUIRED_EXTENSION} onChange={onChange} header="Select Image" Component={AssetsGallery} ButtonIcon={Images} />;
          },
        },
      },
    },
  },
  defaultProps: {
    // gap: "12px",
    heading: "Image with text",
    description: "",
    padding: "24px",
    margin: "12px",
    order: "image-first",
    image: {
      ratio: "small",
      src: "",
      width: 50,
      alt: "",
    },
    button: {
      buttonText: "Button Label",
      url: "",
    },
  },
  label: "Text Image Widget",
  render: (props: ITextImageRenderProps) => {
    return <TextImageRender {...props} />;
  },
};

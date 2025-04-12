import type { IRenderProps } from "../../../../../types/page-builder";
import { AssetsGallery } from "../../../../../component/assets-gallery";
import type { ComponentConfig } from "@measured/puck";
import { ImageRender } from "./ImageRender";
import { MediaPopup } from "../../../../../component/media-popup";
import { Images } from "lucide-react";
import DataStateHandler from "packages/page-builder/src/component/data-handler/DataStateHandler";
import { WIDGET_CONFIGURATION_MESSAGES } from "packages/page-builder/src/constants/constants";
import { MEDIA } from "@znode/constants/images";

export interface IImageConfig {
  image: string;
  height: number;
  width: number;
  alt: string;
  url: string;
}

export type IImageConfigRenderProps = IImageConfig & IRenderProps;

export const ImageConfig: ComponentConfig<IImageConfig> = {
  fields: {
    height: {
      type: "number",
      label: "Height",
    },
    alt: {
      type: "text",
      label: "Alt",
    },
    width: {
      type: "number",
      label: "Width",
      min: 0,
      max: 2400,
    },
    url: {
      type: "text",
      label: "Url",
    },
    image: {
      type: "custom",
      label: "Image",
      render: ({ onChange }) => <MediaPopup mediaType={MEDIA.REQUIRED_EXTENSION} onChange={onChange} header="Select Image" Component={AssetsGallery} ButtonIcon={Images} />,
    },
  },

  defaultProps: {
    alt: "",
    height: 200,
    width: 200,
    url: "",
    image: "",
  },

  label: "Image Widget",

  render: (props: IImageConfigRenderProps) => {
    const { image, ...restProps } = props;
    return (
      <DataStateHandler response={image} emptyMessage={WIDGET_CONFIGURATION_MESSAGES.IMAGE_CONFIGURATION_REQUIRED}>
        {image && <ImageRender image={image} {...restProps} />}
      </DataStateHandler>
    );
  },
};

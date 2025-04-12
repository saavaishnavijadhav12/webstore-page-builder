import { IImageConfigRenderProps } from "./ImageConfig";
import { ImageWidget } from "@znode/base-components/znode-widget/image-widget";

export function ImageRender(props: Readonly<IImageConfigRenderProps>) {
  const { alt, height, width, image, url } = props || {};

  return <ImageWidget srcImg={image} alt={alt} key={props.id} width={width} height={height} url={url} />;
}

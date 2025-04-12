import { Brands } from "@znode/base-components/page-widget/brands";
import { IBrandsPageRenderProps } from "./BrandsPageConfig";

export function BrandsPageRender(props: Readonly<IBrandsPageRenderProps>) {
  if (!props.response?.data) return null;

  const brandList = props.response?.data || [];

  return <Brands brandList={brandList} />;
}

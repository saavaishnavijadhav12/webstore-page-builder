import { ProductDetailsPage } from "@znode/base-components/page-widget/product-details-page";
import { IProductDetailsPageRenderProps } from "./ProductDetailsPageConfig";
import { JsonLd } from "@znode/base-components/common/schema";
import { productSchema } from "@znode/utils/component";
import { useEffect, useState } from "react";



export function ProductDetailsPageRender(props: Readonly<IProductDetailsPageRenderProps>) {
  const { response } = props || {};
  if (!response?.data) {
    return null;
  }

  const data = response?.data || {};
   const [url, setUrl] = useState(""); 
     useEffect(() => {
         setUrl(window.location.origin);
     }, []);

  const productDetails = data;
  const productData = productSchema(productDetails.productBasicDetails, url);

  return (
    <>
      <ProductDetailsPage product={productDetails} />
      <JsonLd jsonLdData={productData} />
    </>
  );
}

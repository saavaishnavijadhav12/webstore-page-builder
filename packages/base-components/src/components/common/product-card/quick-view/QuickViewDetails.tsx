"use client";
const Placeholder = () => (
  <div style={{ textAlign: 'center', padding: '20px', color: '#888', height: "20px", width: "20px" }}>
<LoadingSpinner height={"10px"} width={"10px"} />  </div>
);
import dynamic from "next/dynamic";
import { IProductDetails, IQueryParams } from "@znode/types/product-details";
import { useModal, useProduct } from "../../../../stores";
import { getQuickDetails } from "../../../../http-request";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "../../icons";
const ProductBasicInfo = dynamic(() => import("../../../product/product-details/product-information/ProductBasicInfo").then((mod) => mod.default), { ssr: false, loading: () => <Placeholder /> });
const WishlistMarker = dynamic(() => import("../../wishlist-marker").then((mod) => mod.WishlistMarker), { ssr: false, loading: () => <Placeholder /> });

function QuickViewDetails() {
  const {
    product: { quickViewData },
    setQuickViewData,
  } = useProduct();
  const { closeModal } = useModal();
  const searchParams = useSearchParams();
  const productInformation = quickViewData?.productBasicDetails;
  const productId = productInformation?.znodeProductId
    ? Number(productInformation.znodeProductId)
    : productInformation?.publishProductId
    ? Number(productInformation.publishProductId)
    : 0;
  const getQuickViewInformation = async (queryParams: IQueryParams) => {
    const productInfo = await getQuickDetails(productId, queryParams);
    setQuickViewData(productInfo);
  };

  const getQueryParams = () => {
    const requiredParams = ["parentProductId", "codes", "values", "parentProductSKU", "sku", "selectedCodes", "selectedValues"];
    const queryParams: IQueryParams | null = requiredParams.every((param) => searchParams.get(param))
      ? {
          parentProductId: searchParams.get("parentProductId") || "",
          codes: searchParams.get("codes") || "",
          values: searchParams.get("values") || "",
          parentProductSKU: searchParams.get("parentProductSKU") || "",
          sku: searchParams.get("sku") || "",
          selectedCodes: searchParams.get("selectedCodes") || "",
          selectedValues: searchParams.get("selectedValues") || "",
        }
      : null;

    return queryParams;
  };

  useEffect(() => {
    const queryParams = getQueryParams();
    queryParams && getQuickViewInformation(queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  return (
    <div className="relative">
      <ProductBasicInfo
        productData={quickViewData?.productBasicDetails as IProductDetails}
        isQuickView={true}
        configurableProducts={quickViewData?.configurableProducts}
        closeQuickViewModal={closeModal}
      />
      <WishlistMarker />
    </div>
  );
}

export default QuickViewDetails;

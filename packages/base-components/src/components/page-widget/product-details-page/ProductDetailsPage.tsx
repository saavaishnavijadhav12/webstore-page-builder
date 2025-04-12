import dynamic from "next/dynamic";
const Placeholder = () => (
  <div style={{ textAlign: 'center', padding: '20px', color: '#888', height: "20px", width: "20px" }}>
<LoadingSpinner height={"10px"} width={"10px"} />  </div>
);
import { IConfigurableProduct, IProductDetails, IProductDetailsProps, IProductReview } from "@znode/types/product-details";
import AddToCartNotification from "../../add-to-cart-notification/AddToCartNotification";
import { BreadCrumbs } from "../../common/breadcrumb";
import LinkProducts from "../../product/link-products/LinkProducts";
import { Modal } from "../../common/modal";
import ProductAnalytics from "../../product/product-details/product-analytics/ProductAnalytics";
import ProductTabSection from "../../product/product-details-tabs/ProductTabSection";
import QuickViewDetails from "../../common/product-card/quick-view/QuickViewDetails";
import RecentlyViewProduct from "../../product/recently-view-product/RecentlyViewProduct";
import { LoadingSpinner } from "@znode/base-components/common/icons";
const ProductBasicInfo = dynamic(() => import("../../product/product-details/product-information/ProductBasicInfo").then((mod) => mod.default), { ssr: false, loading: () => <Placeholder />});

export function ProductDetailsPage({ product }: { product: IProductDetailsProps }) {
  const productData = product.productBasicDetails;
  const combinationErrorMessage = productData?.configurableData?.combinationErrorMessage;
  const showLinkProduct = (productData?.youMayAlsoLike  !== "" ||  productData?.frequentlyBought !== "") ? true : false;
  return (
    <div>
      <BreadCrumbs
        znodeCategoryIds={productData?.znodeCategoryIds}
        name={productData?.name}
        isParentCategory={true}
        combinationErrorMessage={productData?.configurableData?.combinationErrorMessage}
        parentConfigurableProductName={productData?.parentConfigurableProductName}
        breadCrumbsTitle={productData?.breadCrumbTitle}
      />
      <ProductBasicInfo
        breadCrumbsTitle={productData?.breadCrumbTitle}
        productData={product.productBasicDetails as IProductDetails}
        configurableProducts={product.configurableProducts as IConfigurableProduct[]}
      />
      {product && product.productBasicDetails && <ProductAnalytics productData={product.productBasicDetails as IProductDetails} />}
      {!combinationErrorMessage && (
        <ProductTabSection
          tabList={product?.tabList || []}
          productReviews={productData?.productReviews as IProductReview[]}
          name={productData?.name || ""}
          sku={productData?.sku || ""}
          productId={productData?.configurableProductId || productData?.publishProductId}
        />
      )}
      {showLinkProduct && <LinkProducts productSku={productData?.sku} productId={productData?.publishProductId} />}
      <AddToCartNotification />
      <RecentlyViewProduct productData={product.productBasicDetails as IProductDetails} />
      <Modal size="5xl" modalId="QuickView" maxHeight="lg" customClass="overflow-y-auto no-print">
        <QuickViewDetails />
        <AddToCartNotification />
      </Modal>
    </div>
  );
}

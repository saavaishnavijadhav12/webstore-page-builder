import dynamic from "next/dynamic";
import { IBundleProductDetails, IConfigurableProduct, IFilteredAttributeList, IProductDetails, IProductInventoryMessage } from "@znode/types/product-details";
import { PRODUCT, PRODUCT_TYPE } from "@znode/constants/product";
const ActionPanel = dynamic(() => import("../../../action-panel/ActionPanel").then((mod) => mod.default), { ssr: false });
import { BundleInventory } from "../inventory/bundle-product-inventory/BundleInventory";
const ConfigurableProductGrid = dynamic(() => import("../product-types/GridView/ConfigurableProductGrid").then((mod) => mod.default), { ssr: false });
const GroupProduct = dynamic(() => import("../product-types/group-product/GroupProduct").then((mod) => mod.default), { ssr: false });
const BundleProduct = dynamic(() => import("../product-types/bundle-product/BundleProduct").then((mod) => mod.BundleProduct), { ssr: false });

import { IAttributesDetails } from "@znode/types/product";
import { LoadingSpinnerComponent } from "../../../common/icons";
import ProductInventory from "../inventory/product-inventory/ProductInventory";
import TypicalLeadTiming from "../../../typical-lead-timing/TypicalLeadTiming";
import { getAttributeValue } from "@znode/utils/common";

interface ISearchParams {
  filteredAttribute: IFilteredAttributeList | undefined;
  errorMessage: string;
  product: IProductDetails;
  isQuickView: boolean;
  configurableProducts: IConfigurableProduct[];
}

const isDisplayVariantsOnGrid = (attributes: IAttributesDetails[]) => {
  const displayVariantsOnGrid = getAttributeValue(attributes, "DisplayVariantsOnGrid", "attributeValues");
  return displayVariantsOnGrid ?? "false";
};

const AdditionalProductDetails = ({ product, errorMessage, isQuickView, configurableProducts }: ISearchParams) => {
  if (!product) {
    return <LoadingSpinnerComponent />;
  }

  const {
    name,
    znodeCategoryIds,
    categoryName,
    sku,
    retailPrice,
    attributes,
    publishBundleProducts,
    isConfigurableProduct,
    productType,
    allowBackOrdering,
    disablePurchasing,
    isObsolete,
    typicalLeadTime,
    quantity,
    stockNotification,
    configurableData,
    inStockMessage,
    outOfStockMessage,
    backOrderMessage,
    isLoginRequired,
    groupProductList,
    filteredAttribute,
    seoUrl,
    znodeProductId,
    publishProductId,
  }: IProductDetails = product;

  const productInventoryMessage: IProductInventoryMessage = { inStockMessage: inStockMessage as string, outOfStockMessage, backOrderMessage: backOrderMessage as string };
  const outOfStockOption = getAttributeValue(attributes as IAttributesDetails[], PRODUCT.OUT_OF_STOCK_OPTIONS, "selectValues");
  const inStockQty = quantity;
  const isDisablePurchasing = outOfStockOption === "DisablePurchasing";
  const isAllowBackOrdering = outOfStockOption === "AllowBackOrdering";

  const combinationErrorMessage = configurableData?.combinationErrorMessage || errorMessage;

  const childBundleItems = product?.publishBundleProducts;
  const productId = znodeProductId ? Number(znodeProductId) : publishProductId ? Number(publishProductId) : 0;
  const productUrl = seoUrl ? "/" + seoUrl : `/product/${productId}`;

  return (
    product && (
      <>
        {!combinationErrorMessage &&
          productType !== PRODUCT_TYPE.BUNDLE_PRODUCT &&
          isDisplayVariantsOnGrid(attributes || []) === "false" && (
            <ProductInventory
              inStockQty={inStockQty}
              loginRequired={isLoginRequired}
              allowBackOrdering={isAllowBackOrdering}
              disablePurchasing={isDisablePurchasing}
              retailPrice={retailPrice}
              isObsolete={isObsolete}
              stockNotification={stockNotification}
              sku={sku}
              productUrl={productUrl}
              productType={productType}
              productInventoryMessage={productInventoryMessage}
              publishProductId={product.publishProductId}
            />
          )}
        {isObsolete && productType === PRODUCT_TYPE.BUNDLE_PRODUCT && (
          <ProductInventory
            inStockQty={inStockQty}
            loginRequired={isLoginRequired}
            allowBackOrdering={allowBackOrdering || isAllowBackOrdering}
            disablePurchasing={disablePurchasing || isDisablePurchasing}
            retailPrice={retailPrice}
            isObsolete={isObsolete}
            stockNotification={stockNotification}
            sku={sku}
            productUrl={productUrl}
            productType={productType}
          />
        )}
        {productType === "BundleProduct" && !isObsolete && (
          <BundleInventory childBundleItems={childBundleItems} retailPrice={retailPrice} publishProductId={product.publishProductId} />
        )}
        {!isObsolete && typicalLeadTime && typicalLeadTime > 0 && (
          <div className="flex gap-2 mt-1">
            <TypicalLeadTiming typicalLeadTime={typicalLeadTime} productType={productType || ""} />
          </div>
        )}
        {publishBundleProducts && productType === PRODUCT_TYPE.BUNDLE_PRODUCT && (
          <BundleProduct
            bundleProducts={publishBundleProducts as IBundleProductDetails[]}
            productType={productType}
            isParentObsolete={isObsolete || false}
            loginRequired={isLoginRequired || false}
            stockNotification={stockNotification || false}
            productUrl={productUrl}
          />
        )}
        {groupProductList && (
          <GroupProduct
            groupProductDetails={groupProductList}
            product={product}
            loginRequired={isLoginRequired}
            stockNotification={stockNotification}
            filteredAttribute={filteredAttribute}
            attributes={product.attributes}
          />
        )}
        {isConfigurableProduct && isDisplayVariantsOnGrid(attributes || []) === "true" && (
          <ConfigurableProductGrid configurableProductDetails={configurableProducts} product={product} loginRequired={isLoginRequired} />
        )}
        {!isQuickView && (
          <div className="mt-4 text-sm">
            <ActionPanel categoryName={categoryName || ""} znodeCategoryIds={znodeCategoryIds || []} productName={name || ""} />
          </div>
        )}
      </>
    )
  );
};
export default AdditionalProductDetails;

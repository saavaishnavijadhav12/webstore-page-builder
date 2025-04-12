import { IProductInventory, IProductListCard } from "@znode/types/product";
import { PRODUCT, PRODUCT_TYPE } from "@znode/constants/product";

import { COMMON } from "@znode/constants/common";
import { FormatPriceWithCurrencyCode } from "../../../common/format-price";
import Link from "next/link";
import { ValidationMessage } from "../../../common/validation-message";
import { useProduct } from "../../../../stores";
import { useTranslations } from "next-intl";

interface IInventory {
  productData: IProductListCard;
  isObsolete: boolean;
  allInventory: string;
  productUrl: string;
}

export function Inventory({ productData, isObsolete, allInventory, productUrl }: Readonly<IInventory>) {
  const productTranslations = useTranslations("Product");
  const { setIsViewReplacementProductTriggered } = useProduct();
  const {
    productType,
    isCallForPricing,
    unitOfMeasurement,
    disablePurchasing,
    isDonTrackInventory,
    discountAmount,
    sku,
    retailPrice,
    salesPrice,
    currencyCode,
    quantity,
    allLocationQuantity,
    inventory,
    isConfigurableProduct,
    publishProductId,
  } = productData;
  const callForPricingMessage = productData.promotions
    ? productData.promotions?.filter((x) => x.promotionType && x.promotionType.toLowerCase() === PRODUCT.CALL_FOR_PRICING_MESSAGE.toLowerCase()).at(0)?.promotionMessage
    : "";

  const isCallForPricingPromotion = productData?.promotions?.some((x) => x.promotionType?.toLowerCase() === PRODUCT.CALL_FOR_PRICING_MESSAGE.toLowerCase());
  const productTypes = () => productType === PRODUCT_TYPE.GROUPED_PRODUCT || productType === PRODUCT_TYPE.CONFIGURABLE_PRODUCT || productType === PRODUCT_TYPE.BUNDLE_PRODUCT;

  const displayDefaultAndAllLocationsInventory = () => {
    const inventoryCount = (inventory && inventory?.reduce((sum, inv) => sum + inv.quantity, 0)) || 0;
    if (quantity !== null && quantity !== undefined && inventoryCount > 0 && disablePurchasing && !isConfigurableProduct) {
      const inventorySKUViewModel = inventory?.find((inv: IProductInventory) => inv.isDefaultWarehouse);
      const defaultInventoryName = inventorySKUViewModel?.warehouseName;
      const defaultInventoryCount = inventorySKUViewModel?.quantity;
      return (
        <div>
          {defaultInventoryName && (
            <div className="text-successColor" data-test-selector={`divDefaultInventoryName${publishProductId}`}>
              {defaultInventoryCount} {defaultInventoryName}
            </div>
          )}
          <div className="text-successColor" data-test-selector={`divTotalInventory${publishProductId}`}>
            {inventory && inventory.length > 0 && inventory.reduce((sum, inv) => sum + inv.quantity, 0)} {productTranslations("allLocations")}
          </div>
        </div>
      );
    } else if (disablePurchasing && !isConfigurableProduct) {
      return <ValidationMessage message={productTranslations("outOfStock")} dataTestSelector={`outOfStockText${publishProductId}`} customClass="text-errorColor" />;
    } else {
      return (
        <div className="text-successColor" data-test-selector={`divPLPInventoryMessage${publishProductId}`}>
          {productTranslations("inventoryDetailsMessage")}
        </div>
      );
    }
  };

  const displaySimpleProductInventory = () => {
    if (disablePurchasing) {
      if ((quantity != null && quantity > 0) || (allLocationQuantity != null && allLocationQuantity > 0)) {
        return (
          <div className="text-successColor" data-test-selector={`divInStockMessage${publishProductId}`}>
            {allLocationQuantity} {productTranslations("inStock")}
          </div>
        );
      } else {
        return <ValidationMessage message={productTranslations("outOfStock")} dataTestSelector={`outOfStockMessage${publishProductId}`} customClass="text-errorColor" />;
      }
    } else {
      return (
        <div className="text-successColor" data-test-selector={`divInventoryMessage${publishProductId}`}>
          {productTranslations("inventoryDetailsMessage")}
        </div>
      );
    }
  };

  const displayAllProductInventory = () => {
    if ((quantity != null && quantity > 0) || productType === PRODUCT_TYPE.BUNDLE_PRODUCT || isConfigurableProduct) {
      return (
        <div className="text-successColor" data-test-selector={`divInventoryText${publishProductId}`}>
          {productTranslations("inventoryDetailsMessage")}
        </div>
      );
    } else {
      return <ValidationMessage message={productTranslations("outOfStock")} dataTestSelector={`outOfStock${publishProductId}`} customClass="text-errorColor" />;
    }
  };

  const renderInventoryDisplay = () => {
    if (allInventory === COMMON.TRUE_VALUE && productType !== PRODUCT_TYPE.BUNDLE_PRODUCT) {
      return displayDefaultAndAllLocationsInventory();
    } else if (!productTypes()) {
      return displaySimpleProductInventory();
    } else {
      return displayAllProductInventory();
    }
  };

  const displayProductInventory = () => {
    return (
      <div className="p-2 bg-gray-100 rounded-sm heading-4">
        <div className="pb-1 tracking-wide" data-test-selector={`divInventoryLabel${publishProductId}`}>
          {productTranslations("inventory")}
        </div>
        {renderInventoryDisplay()}
      </div>
    );
  };

  return (
    <div>
      {isObsolete ? (
        <div className="p-2 mt-2 text-sm font-semibold bg-gray-100">
          <div className="tracking-wide text-errorColor" data-test-selector={`divObsoleteMessage${publishProductId}`}>
            {productTranslations("obsoleteMsg")}{" "}
            <Link href={productUrl} className="border-b-2 border-errorColor" onClick={() => setIsViewReplacementProductTriggered(true)}>
              {productTranslations("obsoleteMsgLink")}
            </Link>{" "}
            {productTranslations("obsoleteMsgProduct")}
          </div>
        </div>
      ) : (
        <>
          {!isCallForPricing && !callForPricingMessage && !isCallForPricingPromotion && (
            <div className="pt-0 break-all heading-2 price" data-test-selector={`divProductPrice${publishProductId}`} data-sku={sku}>
              {salesPrice && salesPrice !== null && retailPrice && retailPrice !== null ? (
                <span className={`pr-3 ${isObsolete ? "text-stone-600 line-through" : "text-linkColor"}`} data-test-selector={`spnSalesPrice${publishProductId}`}>
                  <FormatPriceWithCurrencyCode price={salesPrice} currencyCode={currencyCode || "USD"} />
                  {salesPrice && unitOfMeasurement ? <span>{` / ${unitOfMeasurement}`}</span> : <></>}
                </span>
              ) : (
                <></>
              )}

              <span
                className={`${(!salesPrice && retailPrice) || (!salesPrice && !retailPrice) ? "text-linkColor" : "text-stone-600 line-through"}`}
                data-test-selector={`spnRetailPrice${publishProductId}`}
              >
                <FormatPriceWithCurrencyCode price={retailPrice as number} currencyCode={currencyCode || "USD"} />
                {retailPrice && unitOfMeasurement ? <span>{` / ${unitOfMeasurement}`}</span> : <></>}
              </span>

              {discountAmount ? (
                <span className="ml-1 line-through cut-price text-slate-300" data-test-selector={`spnDiscountPrice${publishProductId}`}>
                  <FormatPriceWithCurrencyCode price={discountAmount} currencyCode={currencyCode || "USD"} />
                </span>
              ) : (
                <></>
              )}
            </div>
          )}
          {callForPricingMessage && (
            <ValidationMessage message={callForPricingMessage} dataTestSelector={`callForPricing${publishProductId}`} customClass="mb-2 text-lg font-medium text-errorColor" />
          )}
          {!isDonTrackInventory && displayProductInventory()}
        </>
      )}
    </div>
  );
}

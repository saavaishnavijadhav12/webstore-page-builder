"use client";

import { IBundleInventory, IPublishBundleProductsDetails } from "@znode/types/product-details";

import { INVENTORY } from "@znode/constants/product";
import { ValidationMessage } from "../../../../common/validation-message";
import { useProduct } from "../../../../../stores/product";
import { useTranslationMessages } from "@znode/utils/component";

export const BundleInventory = ({ childBundleItems, retailPrice, publishProductId }: IBundleInventory) => {
  const productTranslations = useTranslationMessages("Product");
  const {
    product: { productOutOfStock },
  } = useProduct();
  if (!childBundleItems) return null;
  const filterProductList = childBundleItems.filter((item) => {
    const code = item.outOfStockOption;
    return code?.toLowerCase() !== INVENTORY.DONT_TRACK_INVENTORY.toLowerCase();
  });

  function getLowestQuantity(childBundleItems: IPublishBundleProductsDetails[]): number {
    if (!Array.isArray(childBundleItems) || childBundleItems.length === 0) return 0;
    const bundledProductMinQty = childBundleItems.reduce((min: IPublishBundleProductsDetails, current: IPublishBundleProductsDetails) => {
      return Number(current.inStockQty) < Number(min.inStockQty) ? current : min;
    });

    return parseInt(`${Number(bundledProductMinQty.inStockQty) / bundledProductMinQty.bundleProductQuantity}`) || 0;
  }

  const isOutOfStock = filterProductList.some((item) => {
    const code = item.outOfStockOption;
    return item.quantity === 0 && INVENTORY.DISABLE_PURCHASING.toLowerCase() === code?.toLowerCase();
  });
  const isAllowBackOrdering = childBundleItems.every((item) => {
    const code = item.outOfStockOption;
    return code?.toLowerCase() === INVENTORY.ALLOW_BACK_ORDERING.toLowerCase();
  });
  const getMessage = () => {
    const filterProductList = childBundleItems.filter((item) => {
      const code = item.outOfStockOption;
      return code?.toLowerCase() === INVENTORY.DISABLE_PURCHASING.toLowerCase();
    });
    const getLowestQty = getLowestQuantity(filterProductList);
    if (retailPrice === null) {
      return productTranslations("priceNotSet");
    } else if (isOutOfStock) {
      return productTranslations("textOutOfStock");
    } else if (isAllowBackOrdering || getLowestQty === 0) {
      return productTranslations("textInStock");
    } else if (getLowestQty > 0) {
      return productTranslations("inStockWithQty", { qty: getLowestQty });
    } else {
      return productTranslations("textInStock");
    }
  };
  const message = getMessage();
  return productOutOfStock?.productId === publishProductId ? (
    ""
  ) : (
    <ValidationMessage
      message={message}
      dataTestSelector={message === productTranslations("textOutOfStock") || message === productTranslations("priceNotSet") ? "inventoryErrorMessage" : "inventoryMessage"}
      customClass={message === productTranslations("textOutOfStock") || message === productTranslations("priceNotSet") ? "text-errorColor heading-4" : "heading-4 text-green-800"}
    />
  );
};

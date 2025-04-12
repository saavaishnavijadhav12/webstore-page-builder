import { AREA, errorStack, logServer } from "@znode/logger/server";

import { CART_PORTAL_FLAGS } from "@znode/constants/cart";
import { COMMON } from "@znode/constants/common";
import { ICartSettings } from "@znode/types/cart";
import { IPortalDetail } from "@znode/types/portal";
import { getPortalDetails } from "../../portal/portal";
import { ORDER_RECEIPT } from "@znode/constants/order";

export async function getCartPageSettings(): Promise<ICartSettings | null> {
  try {
    const portalData = await getPortalDetails();

    const displayPromoSection = getGlobalAttributeValue(portalData, CART_PORTAL_FLAGS.SHOW_PROMOTION_SECTION);
    const loginRequired = getGlobalAttributeValue(portalData, CART_PORTAL_FLAGS.LOGIN_TO_SEE_PRICING_INVENTORY);
    const isQuoteRequestEnabled = getGlobalAttributeValue(portalData, CART_PORTAL_FLAGS.IS_QUOTE_REQUEST);
    const isShippingEstimatorEnabled = checkIsShippingEstimatorEnabled(portalData);
    const displayShippingConstraints = getGlobalAttributeValue(portalData, ORDER_RECEIPT.SHOW_SHIPPING_CONSTRAINT);
    const loginToSeePricingAndInventory = getGlobalAttributeValue(portalData, CART_PORTAL_FLAGS.LOGIN_TO_SEE_PRICING_INVENTORY);
    const storeSettings = {
      enableQuoteRequest: isQuoteRequestEnabled,
      requireLogin: loginRequired,
      showPromoSection: displayPromoSection,
      enableShippingEstimator: isShippingEstimatorEnabled,
      currencyCode: portalData.currencyCode ?? CART_PORTAL_FLAGS.UNITED_STATES_SUFFIX,
      enableSaveForLater: portalData.enableSaveForLater,
      currencySymbol: portalData.currencySymbol ?? "$",
      enableAddressValidation: portalData.enableAddressValidation,
      enableShippingConstraints: displayShippingConstraints,
      loginToSeePricingAndInventory: loginToSeePricingAndInventory,
    };

    return storeSettings as ICartSettings;
  } catch (error) {
    logServer.error(AREA.CART, errorStack(error));
    return null;
  }
}

export function getGlobalAttributeValue(currentPortal: IPortalDetail, attributeCode: string) {
  const attributeValue = currentPortal.globalAttributes?.find((a) => a?.attributeCode?.toLowerCase() === attributeCode.toLowerCase())?.attributeValue === "true" || false;
  return attributeValue;
}

const checkIsShippingEstimatorEnabled = (currentPortal: IPortalDetail) => {
  const isEstimateShippingCost = currentPortal.globalAttributes?.find(
    (a) => a.attributeCode?.toLowerCase() === CART_PORTAL_FLAGS.SHOW_ESTIMATE_SHIPPING_COST.toLowerCase()
  )?.attributeValue;
  const shippingEstimateCostAttributeValue = isEstimateShippingCost === COMMON.TRUE_VALUE;
  return shippingEstimateCostAttributeValue || false;
};

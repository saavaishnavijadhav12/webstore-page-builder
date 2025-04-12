import { CommerceCollections_classDetailsByClassType } from "@znode/clients/cp";
import { IQuoteDetailsResponse } from "@znode/types/account/quote";
import { convertCamelCase } from "@znode/utils/server";
import { AREA, errorStack, logServer } from "@znode/logger/server";
import { mappedCartItems } from "../../cart/mapper";
import { getCartSummary } from "../../cart";
import { getPortalDetails } from "../../portal/portal";
import { ORDER_DATA_TYPE, ORDER_RECEIPT } from "@znode/constants/order";
import { getGeneralSettingList } from "../../general-setting";
import { isQuoteValidForConvertToOrder } from "../order/order-helper";
import { IGlobalAttributeValues } from "@znode/types/portal";
import { mappedQuoteDetails } from "./mapper";

export async function getUserQuoteDetails(quoteNumber: string): Promise<IQuoteDetailsResponse | null> {
  if (!quoteNumber) {
    return { isSuccess: false } as IQuoteDetailsResponse;
  }

  try {
    const commerceCollectionClassDetail = await CommerceCollections_classDetailsByClassType(ORDER_DATA_TYPE.QUOTE, quoteNumber);
    const quoteDetails = convertCamelCase(commerceCollectionClassDetail);
    const portalData = await getPortalDetails();
    const calculateSummary = await getCartSummary(quoteNumber, undefined, undefined, true);
    const formattedResponse = convertCamelCase(calculateSummary);

    if (quoteDetails?.lineItemDetails) {
      quoteDetails.lineItemDetails = mappedCartItems(quoteDetails.lineItemDetails);
    }
    quoteDetails.enableConvertToOrder = isQuoteValidForConvertToOrder(quoteDetails);
    const generalSetting = await getGeneralSettingList();

    const isShippingConstraint = portalData?.globalAttributes?.find(
      (a: IGlobalAttributeValues) => a.attributeCode?.toLowerCase() === ORDER_RECEIPT.SHOW_SHIPPING_CONSTRAINT.toLowerCase()
    )?.attributeValue;
    const mappedQuoteDetailsData = mappedQuoteDetails(quoteDetails, generalSetting, isShippingConstraint || "") || {};

    return {
      quoteData: mappedQuoteDetailsData,
      calculateSummary: formattedResponse,
      isSuccess: true,
    };
  } catch (error) {
    logServer.error(AREA.QUOTE, errorStack(error));
    return null;
  }
}

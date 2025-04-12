import { IQuoteDetails } from "@znode/types/account";
import { IAddress } from "@znode/types/address";
import { IGeneralSetting } from "@znode/types/general-setting";
import { convertDate } from "@znode/utils/component";

export const mappedQuoteDetails = (quoteDetails: IQuoteDetails, generalSetting: IGeneralSetting, isShippingConstraint: string) => {
  return {
    inHandDate: convertDate(quoteDetails?.inHandDate || "", generalSetting?.dateFormat, generalSetting?.displayTimeZone),
    quoteNumber: quoteDetails?.classNumber,
    cultureCode: quoteDetails?.cultureCode,
    userName: quoteDetails?.userName,
    phoneNumber: quoteDetails?.phoneNumber,
    createdDate: convertDate(quoteDetails?.createdDate || "", generalSetting?.dateFormat, generalSetting?.displayTimeZone),
    expirationDate: convertDate(quoteDetails?.expirationDate || "", generalSetting?.dateFormat, generalSetting?.displayTimeZone),
    classStateName: quoteDetails?.classStateName,
    address: quoteDetails?.address,
    total: quoteDetails?.total,
    createdByFullName: quoteDetails?.createdByFullName,
    shippingMethodName: quoteDetails?.orderShipments?.shippingMethodName,
    configurationSetCode: quoteDetails?.paymentDetails?.configurationSetCode,
    enableConvertToOrder: quoteDetails?.enableConvertToOrder,
    billingAddressId: quoteDetails?.address?.find((x: IAddress) => x.isBilling === true)?.addressId,
    shippingAddressId: quoteDetails?.address?.find((x: IAddress) => x.isShipping === true)?.addressId,
    billingAddress: quoteDetails?.address?.find((x: IAddress) => x.isBilling === true),
    shippingAddress: quoteDetails?.address?.find((x: IAddress) => x.isShipping === true),
    isShippingConstraint: isShippingConstraint === "true",
    lineItemDetails: quoteDetails?.lineItemDetails?.map((item) => ({
      productName: item.productName,
      sku: item.sku,
      productDescription: item.productDescription,
      quantity: item.quantity,
      unitPrice: item.itemPrice,
      productImageUrl: item.productImageUrl,
      totalPrice: item.totalPrice,
    })),
    shippingConstraintCode: quoteDetails?.orderShipments?.shippingConstraintCode || "",
  };
};

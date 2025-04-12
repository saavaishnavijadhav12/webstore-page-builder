import { ICalculateSummary, ICommerceCollectionClassDetail, IOrder, IOrderLineItem, IOrderLineItems, IOrdersList } from "@znode/types/account";

import { IAddress } from "@znode/types/address";
import { IGeneralSetting } from "@znode/types/general-setting";
import { IPortalDetail } from "@znode/types/portal";
import { convertDate, convertDateTime } from "@znode/utils/component";
import { getGlobalAttributeValue } from "../../cart";
import { ORDER_RECEIPT } from "@znode/constants/order";

export const mapOrderLineItems = (orderItem: IOrderLineItem) => {
  return {
    id: orderItem.omsOrderLineItemsId as number,
    price: orderItem.price,
    name: orderItem.productName as string,
    productName: orderItem.productName as string,
    quantity: orderItem.quantity,
    total: orderItem.total,
    sku: orderItem.sku,
    productType: orderItem.productType,
    description: orderItem.description,
    currencyCode: orderItem.currencyCode,
    trackingNumber: orderItem.trackingNumber,
    orderLineItemState: orderItem.orderLineItemState,
    personaliseValuesDetail: orderItem.personaliseValuesDetail,
    parentOmsOrderLineItemsId: orderItem.parentOmsOrderLineItemsId,
    personaliseValueList: orderItem.personaliseValueList,
    shippingAddressHtml: orderItem.shippingAddressHtml,
  };
};

export const mapToOrdersList = (order: IOrder, generalSetting: IGeneralSetting): IOrdersList => {
  return {
    orderNumber: order.classNumber || "",
    paymentStatus: order.paymentStatus,
    orderState: order.classStatus,
    orderDate: convertDateTime(order.orderDate as string, generalSetting?.dateFormat, generalSetting?.timeFormat, generalSetting?.displayTimeZone),
    total: order.total,
    paymentDisplayName: order.paymentName,
    paymentType: order.paymentType,
  };
};

export const mappedOrderDetails = (
  commerceCollectionClassDetail: ICommerceCollectionClassDetail,
  calculateSummary: ICalculateSummary,
  portalData: IPortalDetail,
  generalSetting: IGeneralSetting
) => {
  const shippingConstraintAttributeValue = getGlobalAttributeValue(portalData, ORDER_RECEIPT.SHOW_SHIPPING_CONSTRAINT);
  return {
    storeName: portalData?.storeName || "",
    userId: commerceCollectionClassDetail.userId || 0,
    classNumber: commerceCollectionClassDetail?.classNumber || "",
    userName: commerceCollectionClassDetail?.userName || "",
    additionalInstructions: commerceCollectionClassDetail?.additionalInstructions?.information ?? "",
    jobName: commerceCollectionClassDetail?.additionalInstructions?.name || "",
    address:
      commerceCollectionClassDetail?.address?.map((address: IAddress) => ({
        isBilling: address.isBilling,
        isShipping: address.isShipping,
        street: address.street,
        city: address.cityName,
        state: address.state,
        zipCode: address.zipCode,
        address1: address.address1,
        address2: address.address2,
        addressId: address.addressId,
        companyName: address.companyName,
        countryName: address.countryName,
        displayName: address.displayName,
        firstName: address.firstName,
        lastName: address.lastName,
        postalCode: address.postalCode,
        stateName: address?.stateName,
        cityName: address?.cityName,
        phoneNumber: address?.phoneNumber,
      })) || [],
    orderLineItems:
      commerceCollectionClassDetail?.lineItemDetails?.map((item: IOrderLineItems) => ({
        itemName: item.itemName || "",
        quantity: item.quantity || 0,
        price: item.itemPrice || 0,
        id: item?.cartItemId,
        name: item?.productName,
        total: item?.totalPrice,
        sku: item?.sku,
        description: item?.productDescription,
        shippingCost: item?.shippingCost,
        orderLineItemState: item?.orderLineItemState,
      })) || [],
    cultureCode: commerceCollectionClassDetail?.cultureCode || "USD",
    orderNumber: commerceCollectionClassDetail?.classNumber || "",
    shippingConstraintCode: commerceCollectionClassDetail?.orderShipments?.shippingConstraintCode || "",
    isShippingConstraint: shippingConstraintAttributeValue,
    inHandDate: convertDate(commerceCollectionClassDetail?.orderShipments?.inHandDate as string, generalSetting?.dateFormat, generalSetting?.displayTimeZone),
    createdDate: convertDate(commerceCollectionClassDetail?.createdDate as string, generalSetting?.dateFormat, generalSetting?.displayTimeZone),
    shippingTypeName: commerceCollectionClassDetail?.orderShipments?.shippingMethodName || "",
    isOrderEligibleForReturn: !!commerceCollectionClassDetail?.isOrderEligibleForReturn,
    costFactorResponse: calculateSummary.costFactorResponse,
    calculateSummary: {
      subTotal: calculateSummary?.subTotal || 0,
      taxCost: calculateSummary?.taxCost || 0,
      shippingCost: calculateSummary?.shippingCost || 0,
      total: calculateSummary?.giftCardAmount && calculateSummary?.total ? calculateSummary?.total - calculateSummary.giftCardAmount : calculateSummary?.total,
      csrDiscountAmount: calculateSummary?.csrDiscountAmount,
      returnCharges: calculateSummary?.returnCharges,
      giftCardAmount: calculateSummary?.giftCardAmount,
      handlingFee: calculateSummary?.handlingFee,
      totalDiscount: calculateSummary?.totalDiscount,
      shippingDiscount: calculateSummary?.shippingDiscount,
    },
    remainingOrderAmount: commerceCollectionClassDetail?.remainingOrderAmount || 0,
    paymentDate: commerceCollectionClassDetail.paymentDate || "",
    paymentSubTypeCode: commerceCollectionClassDetail?.paymentDetails?.paymentSubTypeCode,
    paymentDisplayName: commerceCollectionClassDetail?.paymentDetails?.paymentName,
    trackingNumber: commerceCollectionClassDetail?.orderShipments?.trackingNumber,
    amount: commerceCollectionClassDetail.amount || 0,
    currencyCode: commerceCollectionClassDetail.currencyCode || "USD",
    orderState: commerceCollectionClassDetail.classStateName || "",
    couponCode: commerceCollectionClassDetail.couponCode || "",
    billingAddress: commerceCollectionClassDetail?.address?.find((x) => x.isBilling === true) || {},
    shippingAddress: commerceCollectionClassDetail?.address?.find((x) => x.isShipping === true) || {},
    total: commerceCollectionClassDetail.total,
    convertedClassNumber: commerceCollectionClassDetail?.convertedClassNumber,
    isBillingAddressOptional: commerceCollectionClassDetail?.paymentDetails?.isBillingAddressOptional,
  };
};

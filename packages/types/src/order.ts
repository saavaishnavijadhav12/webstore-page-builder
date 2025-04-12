import { IAdditionalInstructionRequestModel, ICalculateSummary, ICartItem, ICosts, IDiscountFactor } from "./cart";

import { IAddressDetails } from "./address";
import { IPaymentDetails } from "./payment";

export interface IOrderShipping {
  shippingId?: number;
  shippingName?: string;
  shippingDiscountDescription?: string;
  responseCode?: string;
  responseMessage?: string;
  shippingCountryCode?: string;
  shippingHandlingCharge?: number;
  shippingDiscount?: number;
  isValidShippingSetting?: boolean;
  shippingDiscountApplied?: boolean;
  shippingCode?: string;
  shippingTypeName?: string;
  accountNumber?: string;
  shippingMethod?: string;
  omsOrderDetailsId?: number;
  userId?: number;
  shippingTypeId?: number;
  shippingDiscountType?: number;
}

export interface IOrderDiscountModel {
  createdBy?: number;
  createdDate?: Date;
  modifiedBy?: number;
  modifiedDate?: Date;
  actionMode?: string;
  custom1?: string;
  custom2?: string;
  custom3?: string;
  custom4?: string;
  custom5?: string;
  omsOrderDiscountId?: number;
  omsOrderDetailsId?: number;
  omsOrderLineItemId?: number;
  omsDiscountTypeId?: number;
  discountCode?: string;
  discountAmount?: number;
  originalDiscount?: number;
  description?: string;
  discountType?: string;
  perQuantityDiscount?: number;
  parentOmsOrderLineItemsId?: number;
  discountMultiplier?: number;
  discountLevelTypeId?: number;
  promotionName?: string;
  promotionTypeId?: number;
  discountAppliedSequence?: number;
  promotionMessage?: string;
  sku?: string;
  groupId?: string;
}

export interface IUpdateOrderPayment {
  classNumber: string;
  billingAddressId: number;
  userId?: number;
  paymentDetails: IPaymentDetails;
}
export interface IOrderReceipt {
  commerceCollectionClassDetail?: ICommerceCollectionClassDetail;
  calculateSummary?: ICalculateSummary;
  hasError: boolean;
}

export interface ICommerceCollectionClassDetail {
  shippingType?: string;
  enableConvertToOrder?: boolean;
  classCode?: string;
  classNumber?: string;
  accountId?: number;
  type?: string;
  origin?: string;
  createdDate?: string;
  classStateName?: string;
  userName?: string;
  total?: string;
  createdByFullName?: string;
  modifiedByFullName?: string;
  assignToFullName?: string;
  cultureCode?: string;
  lineItemDetails?: ICartItem[];
  orderShipments?: IShipmentDetails;
  orderDiscounts?: IDiscountFactor[];
  address?: IAddressDetails[];
  expirationDate?: Date;
  jobName?: string;
  phoneNumber?: string;
  storeName?: string;
  inHandDate?: string;
  paymentDetails?: IPaymentDetails;
  additionalInstructions?: IAdditionalInstructionRequestModel;
  hasError?: boolean;
  subTotal?: number;
  costFactorResponse: ICosts[];
}

//TODO deprecated : Remove this interface instead use ICartItem. Do not refer for future use.
export interface ILineItemDetails {
  sku?: string;
  productImageUrl?: string;
  itemId?: string;
  productName?: string;
  productDescription?: string;
  quantity?: number;
  unitPrice?: number;
  groupCode?: string;
  productImagePath?: string;
  productType?: string;
  seoUrl?: string;
  itemPrice?: number;
  totalPrice?: number;
  itemName: string;
  cartItemId: number;
}

export interface IShipmentDetails {
  orderShipmentId?: string;
  orderAddressId?: string;
  shippingId?: number;
  shipDate?: string;
  isShipCompletely?: boolean;
  shippingConstraintCode?: string;
  phoneNumber?: string;
  addressId?: number;
  shippingMethodName?: string;
  trackingNumber?: string | undefined;
  inHandDate?: string;
}

export interface IOrderShipping {
  shippingId?: number;
  shippingName?: string;
  shippingDiscountDescription?: string;
  responseCode?: string;
  responseMessage?: string;
  shippingCountryCode?: string;
  shippingHandlingCharge?: number;
  shippingDiscount?: number;
  isValidShippingSetting?: boolean;
  shippingDiscountApplied?: boolean;
  shippingCode?: string;
  shippingTypeName?: string;
  accountNumber?: string;
  shippingMethod?: string;
  omsOrderDetailsId?: number;
  userId?: number;
  shippingTypeId?: number;
  shippingDiscountType?: number;
}

export interface IReorderRequestModel {
  orderNumber?: string | undefined;
  orderOrigin?: string | undefined;
  itemId?: string | undefined;
}

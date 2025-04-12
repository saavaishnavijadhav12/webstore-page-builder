import { deleteCookie, removeLocalStorageData, setCookie } from "@znode/utils/component";

import { ADDRESS } from "@znode/constants/address";
import { CART_COOKIE } from "@znode/constants/cookie";
import { CHECKOUT } from "@znode/constants/checkout";
import { COMMON } from "@znode/constants/common";
import { ISubmitOrder } from "@znode/types/checkout";
import { IAddress } from "@znode/types/address";
import { IPaymentAddress } from "@znode/types/payment";

export async function submitOrder(submitOrderModel: ISubmitOrder) {
  if (submitOrderModel?.cartNumber) {
    if (submitOrderModel.orderResponse?.isSuccess && submitOrderModel.orderResponse.orderNumber) {
      setCookie(CHECKOUT.USER_ORDER_RECEIPT_ORDER_ID, submitOrderModel.orderResponse.orderNumber.toString());
      deleteCookie(CART_COOKIE.CART_NUMBER);
      deleteCookie(CART_COOKIE.CART_ID);
      removeLocalStorageData(ADDRESS.ONETIME_ADDRESS_IDS);
      removeLocalStorageData(COMMON.SESSION_KEY + submitOrderModel.cartNumber);
      removeLocalStorageData(COMMON.GUEST_USER_KEY + submitOrderModel.cartNumber);
    }
    return submitOrderModel.orderResponse;
  }
}

export async function mapPaymentAddress(checkoutAddress: IAddress) {
    const paymentAddress = {
      state: checkoutAddress.stateName,
      country: checkoutAddress.countryName,
      city: checkoutAddress.cityName,
      firstName: checkoutAddress.firstName,
      lastName: checkoutAddress.lastName,
      addressLine1: checkoutAddress.address1,
      addressLine2: checkoutAddress.address2,
      zipCode: checkoutAddress.postalCode,
    } as IPaymentAddress;
    return paymentAddress;
}
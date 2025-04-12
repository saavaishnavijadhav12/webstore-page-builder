import { IAnonymousUserAddressResponse } from "@znode/types/user";
import { setCart } from "../cart/cart-helper";
import { IAddress } from "@znode/types/address";

export const processUserAddressResponse = async (userAddressResponse: IAnonymousUserAddressResponse, cartNumber: string, shippingAddress: IAddress, billingAddress: IAddress) => {
  if (!userAddressResponse?.hasError && userAddressResponse.shippingAddressId && userAddressResponse.billingAddressId) {
    const address = {
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
    };

    await setCart(address, true, cartNumber);
    return true;
  }
  return false;
};

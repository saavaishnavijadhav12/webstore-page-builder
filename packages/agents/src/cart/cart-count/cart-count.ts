import { Carts_countByClassType } from "@znode/clients/cp";
import { ORDER_DATA_TYPE } from "@znode/constants/order";
import { AREA, errorStack, logServer } from "@znode/logger/server";

export async function getCartCount(cartNumber: string) {
  if (!cartNumber || cartNumber === "undefined" ) {
    logServer.error(AREA.CART, "Cart Number Not Found.");
    return 0;
  }

  try {
    const response = await Carts_countByClassType(ORDER_DATA_TYPE.CARTS, cartNumber);
    return response?.CartCount || 0;
  } catch (error) {
    logServer.error(AREA.CART, errorStack(error));
    return 0;
  }
}

import { httpRequest } from "../../base";

export const getCartCount = async (cartNumber: string) => {
  const cartCount = await httpRequest<number>({ endpoint: `/api/cart/cart-count?cartNumber=${cartNumber}` });
  return cartCount;
};

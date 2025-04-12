"use server";

import { getCartCount, getCartNumber } from "@znode/agents/cart";
import { getNavigationCategory } from "@znode/agents/category";
import { CART_COOKIE } from "@znode/constants/cookie";
import { IUser } from "@znode/types/user";
import { IPageStructure } from "@znode/types/visual-editor";
import { getSavedUserSession } from "@znode/utils/common";
import { getCookieRuntime } from "@znode/utils/component";


export async function prepareHeaderData(preparedDataCache: IPageStructure) {
    if (
      preparedDataCache.key === "layout" &&
      preparedDataCache.headerData?.content &&
      preparedDataCache.headerData.content.length > 0 &&
      preparedDataCache.headerData.content[0]?.props?.response?.data
    ) {
      const userData: IUser | null = await getSavedUserSession();
      let cartNumber = getCookieRuntime(CART_COOKIE.CART_NUMBER);
      if (!cartNumber) {
        cartNumber = Number(userData?.userId) > 0 ? await getCartNumber(Number(userData?.userId)) : "";
      }
      const cartCountResponse = await getCartCount(String(cartNumber) || "");
      preparedDataCache.headerData.content[0].props.response.data.cartCount = cartCountResponse || 0;
      if (Number(userData?.userId) > 0) {
        const { categories } = await getNavigationCategory(userData);
        preparedDataCache.headerData.content[0].props.response.data.categories = categories;
      }
    }
    return preparedDataCache;
}

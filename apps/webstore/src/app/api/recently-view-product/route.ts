import { sendError, sendSuccess } from "@znode/utils/server";

import { IRecentlyViewedSkuProductList } from "@znode/types/product-details";
import { getPortalDetails } from "@znode/agents/portal";
import { getRecentlyViewProducts } from "@znode/agents/product";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload: IRecentlyViewedSkuProductList[] = await request.json();
     
     const portalData = await getPortalDetails();
    const productList = await getRecentlyViewProducts(payload, portalData);
    return sendSuccess(productList, "Retrieved recently viewed product list successfully");
  } catch (error) {
    return sendError("An error occurred while fetching the recently viewed product list" + String(error), 500);
  }
}

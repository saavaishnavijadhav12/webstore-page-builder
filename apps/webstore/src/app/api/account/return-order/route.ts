import { convertCamelCase, getPortalHeader, sendError, sendSuccess } from "@znode/utils/server";

import { getReturnList } from "@znode/agents/account/return-order/get-return-list";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = Number(searchParams.get("pageSize"));
    const pageIndex = Number(searchParams.get("pageIndex"));
    const sortValue = searchParams.get("sortValue");
    const currentFiltersString = searchParams.get("currentFilters");

    if (!pageSize || !pageIndex || !sortValue || !currentFiltersString) {
      return sendError("Missing or invalid query parameters.", 400);
    }
    const currentFilters = JSON.parse(currentFiltersString);
    const sortValues = JSON.parse(sortValue);
    const portalData = getPortalHeader();
    const orderHistoryData = await getReturnList(pageSize, pageIndex, sortValues, currentFilters, portalData);
    const orderHistoryDetails = convertCamelCase(orderHistoryData);
    return sendSuccess(orderHistoryDetails, "Return order retrieved successfully.");
  } catch (error) {
    return sendError("An error occurred while retrieving return order: " + String(error), 500);
  }
}

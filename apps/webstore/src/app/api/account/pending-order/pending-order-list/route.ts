import { sendError, sendSuccess } from "@znode/utils/server";
import { getPendingOrderList } from "@znode/agents/account";
import { getSavedUserSession } from "@znode/utils/common";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = Number(searchParams.get("pageSize"));
    const pageIndex = Number(searchParams.get("pageIndex"));
    const sortValue = searchParams.get("sortValue");
    const currentFiltersString = searchParams.get("currentFilters");
    const currentFilters = JSON.parse(currentFiltersString || "");
    const sortValues = JSON.parse(sortValue || "");
    const status = searchParams.get("status") || "";

    const userData = await getSavedUserSession();
    if (userData?.userId) {
      const pendingOrderList = await getPendingOrderList(status, pageSize, pageIndex, sortValues, currentFilters);
      return sendSuccess(pendingOrderList);
    } else {
      return sendError(`Invalid User ID ${userData?.userId}.`, 403);
    }
  } catch (error) {
    return sendError("An error occurred while fetching the list of pending order history. " + String(error), 500);
  }
}

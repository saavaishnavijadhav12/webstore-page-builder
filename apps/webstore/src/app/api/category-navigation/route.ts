import { sendError, sendSuccess } from "@znode/utils/server";

import { getNavigationCategory } from "@znode/agents/category";

export async function GET() {
  try {
    const {categories, isUserLoggedIn} = await getNavigationCategory();
    return sendSuccess({categories, isUserLoggedIn}, "mega-menu category list retrieved successfully ");
  } catch (error) {
    return sendError("An error occurred while fetching the mega-menu category list" + String(error), 500);
  }
}

import { getCartCount } from "@znode/agents/cart";
import { sendError, sendSuccess } from "@znode/utils/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartNumber = searchParams.get("cartNumber") || "";

    const cartCountResponse = await getCartCount(cartNumber);
    return sendSuccess(cartCountResponse);
  } catch (error) {
    return sendError("Failed to get cart count." + String(error), 500);
  }
}

import { sendError, sendSuccess } from "@znode/utils/server";

import { getPortalDetails } from "@znode/agents/portal/portal";

export async function GET() {
  try {
    
    const portalData = await getPortalDetails();
    const { portalLocales } = portalData;
    const PortalDetails = {
      portalLocales : portalLocales,
      portalId : portalHeader.portalId,
      localeId : portalHeader.localeId
    };
    return sendSuccess(PortalDetails, "Portal details received successfully.");
  } catch (error) {
    return sendError("An error occurred while fetching the portal details" + String(error), 500);
  }
}

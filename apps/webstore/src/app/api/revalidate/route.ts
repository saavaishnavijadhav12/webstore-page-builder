/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearDataInGlobalCache } from "@znode/utils/server";
import dayjs from "dayjs";
import { revalidateTag } from "next/cache";
import { createOrUpdateExistingFile } from "packages/cache/src/file/file";
import { clearCategoryPageCaching, clearHomePageCaching, clearLayoutPageCaching, clearPortalCaching, clearProductPageCaching, clearTagLevelCaching } from "@znode/agents/revalidate";
import { EVENT_NAME } from "@znode/constants/cache-keys";


export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log("request data for revalidation received from API ---> ", requestData);
    if (requestData.EventType === "Cache") {
      const tag: string[] = await clearTagLevelCaching(requestData);
      
      if (
        requestData.EventName === EVENT_NAME.PortalPublishEvent ||
        requestData.EventName === EVENT_NAME.PortalUpdateEvent ||
        requestData.EventName === EVENT_NAME.VisualEditorPublishEvent ||
        requestData.EventName === EVENT_NAME.ManuallyRefreshWebStoreCacheEvent
      ) {
        await clearPortalCaching(tag);
      }

      if (
        requestData.EventName === EVENT_NAME.ProductPublishEvent ||
        requestData.EventName === EVENT_NAME.CustomerReviewUpdateEvent ||
        requestData.EventName === EVENT_NAME.ProductPriceUpdateEvent ||
        requestData.EventName === EVENT_NAME.ProductInventoryUpdateEvent
      ) {
        await clearProductPageCaching(tag);
      }

      if (
        requestData.EventName === EVENT_NAME.CategoryPublishEvent ||
        requestData.EventName === EVENT_NAME.ProductPriceUpdateEvent ||
        requestData.EventName === EVENT_NAME.ProductInventoryUpdateEvent
      ) {
        await clearCategoryPageCaching(tag);
      }

      if (requestData.EventName === EVENT_NAME.BannerSliderPublishEvent || requestData.EventName === EVENT_NAME.ContentContainerPublishEvent) {
        await clearHomePageCaching();
      }

      if (requestData.EventName === EVENT_NAME.CatalogPublishEvent){
        await clearLayoutPageCaching();
      }

        tag.forEach((tag) => {
          revalidateTag(tag);
        });
      clearDataInGlobalCache();
      console.log("data evicted with tag ->", tag);


      const formattedDate = dayjs().format("DD-MM-YYYY");
      await createOrUpdateExistingFile("revalidate-request", formattedDate, requestData);
      return new Response("revalidated successfully ", { status: 200 });
    }
    return new Response("event triggered Successfully", { status: 200 });
  } catch (error) {
    return new Response("failed to revalidate.", { status: 500 });
  }
}

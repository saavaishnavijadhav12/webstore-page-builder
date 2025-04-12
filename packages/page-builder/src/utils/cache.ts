import { createOrUpdate, get } from "@znode/cache";
import { PAGE_CONSTANTS } from "@znode/page-builder/page-constant";
import { IPortalDetail } from "@znode/types/portal";
import { getSavedUserSession } from "@znode/utils/common";
import { cookies } from "next/headers";

export const generateCacheKey = async (pageCode: string, id: string | null, storeDetails: IPortalDetail): Promise<string> => {
  const session = await getSavedUserSession();
  const locale = cookies().get("NEXT_LOCALE")?.value || "en-US";
  const profileId = session?.profileId ?? 0;
  const accountId = session?.accountId ?? 0;
  const key = `${pageCode}_${id}_${accountId}_${String(storeDetails.publishState)}_${locale}_${profileId}`;
  return key;
};



export const getContent = async (storeDetails: IPortalDetail, id: string | null, pageCode?: string, isDynamic?: boolean): Promise<any> => {
  const enableCaching: boolean = true;
  console.log("process.env.ENABLE_PAGE_CACHE", process.env.ENABLE_PAGE_CACHE);
  if (process.env.ENABLE_PAGE_CACHE === "true" && !isDynamic) {
    if (process.env.APP_NAME == "WEBSTORE" && (pageCode == PAGE_CONSTANTS.PAGE_CODES.HOME || pageCode == PAGE_CONSTANTS.PAGE_CODES.CATEGORY || pageCode == PAGE_CONSTANTS.PAGE_CODES.LAYOUT || pageCode == PAGE_CONSTANTS.PAGE_CODES.PRODUCT)) {
      let cacheKey = await generateCacheKey(pageCode ?? "", id, storeDetails);
      const preparedDataCache = await get(storeDetails.storeCode || "", cacheKey);
      if (preparedDataCache)
        console.log("fetched from cache")
      return preparedDataCache;
    }
  }
}


export const setContent = async<T>(storeDetails: IPortalDetail, data: T, id: string | null, pageCode?: string, isDynamic?: boolean): Promise<any> => {
  const enableCaching: boolean = true;

  if (process.env.ENABLE_PAGE_CACHE === "true" && !isDynamic) {
    if (process.env.APP_NAME == "WEBSTORE" && (pageCode == PAGE_CONSTANTS.PAGE_CODES.HOME || pageCode == PAGE_CONSTANTS.PAGE_CODES.CATEGORY || pageCode == PAGE_CONSTANTS.PAGE_CODES.LAYOUT || pageCode == PAGE_CONSTANTS.PAGE_CODES.PRODUCT)) {
      let cacheKey = await generateCacheKey(pageCode ?? "", id, storeDetails ?? 0);
      const jsonData = {
        key: cacheKey,
        ...data,
      };
      await createOrUpdate(storeDetails.storeCode || "", cacheKey, jsonData)
    }
  }
}
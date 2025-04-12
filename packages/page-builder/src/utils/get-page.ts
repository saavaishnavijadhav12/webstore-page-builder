"use server";

import { extractDynamicValue, replaceDynamicSegment } from "./common";
import { getContent, setContent } from "./cache";

import type { Data } from "@measured/puck";
import { ErrorCodes } from "@znode/types/enums";
import { getPortalHeader } from "@znode/utils/server";
import { redirect } from "next/navigation";
import { validateContentByProfile } from "@znode/agents/content-page";
import { INullablePageStructure, IPageStructure } from "@znode/types/visual-editor";
import { APP_NAME } from "@znode/constants/app";
import { getLocalPageStructure } from "./page-structure/get-local-page-structure";
import { IPageVariant } from "../types/page-builder";
import { getServerPageStructure } from "./page-structure/get-server-page-structure";
import { PAGE_CONSTANTS } from "@znode/page-builder/page-constant";
import { processHeaderFooterAndMainContentData } from "./process-header-footer-and-content-data";

const slashRegex = /\//g;
interface IGetPageParam {
  url: string;
  pageCode?: string;
  storeCode?: string;
  contentPageCode?: string;
  publishState?: string;
  searchParams?: any;
  isDebug?: boolean;
  theme: string;
  contentPageId?: number | undefined;
  pageVariant?: IPageVariant;
}

const emptyData: Data = {
  content: [],
  root: {},
};

const defaultPageStructure: IPageStructure = {
  key: "",
  data: emptyData,
};

export async function getPage({ url, pageCode, storeCode, contentPageCode, publishState, searchParams, contentPageId, pageVariant }: IGetPageParam): Promise<IPageStructure> {
  let urlWithPlaceholder = replaceDynamicSegment(url); // ** Note: Replace the numeric portion of the URL in params.url with a placeholder "{}"
  let id: string | null = extractDynamicValue(url);
  const publicId = urlWithPlaceholder.replace(slashRegex, "_"); // ** Note: Replace slash with underscore
  const isDynamic = Object.keys(searchParams || {}).length !== 0;

  try {
    const details = await getPortalHeader();
    storeCode = storeCode || details.storeCode;
    publishState = String(publishState || details.publishState)?.toLowerCase();
    const appName = process.env.APP_NAME;
    let hasDefaultPageStructure = false;

    if (contentPageCode && appName === APP_NAME.WEBSTORE) {
      const contentData = await validateContentByProfile(contentPageCode, details);
      if (contentData === false) hasDefaultPageStructure = true;
    }

    if (!pageCode && !contentPageCode) {
      pageCode = urlWithPlaceholder.split("/")[0];
    }
    const preparedDataCache: IPageStructure = await getContent(details, id, pageCode, isDynamic);
    if (preparedDataCache) {
      return preparedDataCache;
    }
    let pageStructure: INullablePageStructure = null;

    if (process.env.IS_DEBUGGING === "true") {
      pageStructure = await getLocalPageStructure(
        String(details.storeCode),
        publicId,
        pageVariant || (PAGE_CONSTANTS.GENERAL.MAIN_CONTENT as IPageVariant),
        hasDefaultPageStructure
      );
    } else {
      pageStructure = await getServerPageStructure(
        pageCode ?? "",
        contentPageCode ?? "",
        storeCode ?? "",
        publishState,
        publicId,
        pageVariant ?? (PAGE_CONSTANTS.GENERAL.MAIN_CONTENT as IPageVariant),
        hasDefaultPageStructure
      );
    }

    if (pageStructure === null) return defaultPageStructure;

    const { footerData, headerData, mainData } = await processHeaderFooterAndMainContentData({
      pageStructure: pageStructure,
      id: id,
      contentPageId: contentPageId,
      searchParams: searchParams,
    });

    const finalPageStructure = { data: mainData || emptyData, key: pageStructure?.key || "", headerData, footerData };

    console.log("serving fresh from API");
    if (finalPageStructure) await setContent(details, finalPageStructure, id, pageCode, isDynamic);
    return finalPageStructure;
  } catch (error: any) {
    if (error.message === ErrorCodes.InvalidStoreCode) {
      redirect("/error");
    } else {
      console.error("Error in getPage:", error);
    }
    return defaultPageStructure;
  }
}

export type { IPageVariant };

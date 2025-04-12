import type { Data } from "@measured/puck";
import { IPageVariant } from "../../types/page-builder";
import { IExtendedData, INullablePageStructure } from "@znode/types/visual-editor";
import { getPreviewContentPageDetails, getPreviewPageDetails, getProductionContentPageDetails, getProductionPageDetails } from "@znode/base-components/http-request";
import { createPageStructure, hasFooter, hasHeader, hasMainContent, hasNotAllOrLayout } from "../common";
import { PAGE_CONSTANTS } from "@znode/page-builder/page-constant";

const defaultData: IExtendedData = { content: [], zones: {}, root: {}, isPageUnavailable: true };

// ** Production or Preview Page Json
async function fetchProductionOrPreviewPageStructure(pageCode: string, contentPageCode: string, storeCode: string, publishState: string): Promise<INullablePageStructure> {
  if (publishState === "production") {
    return contentPageCode ? getProductionContentPageDetails({ contentPageCode, portalCode: storeCode }) : getProductionPageDetails({ pageCode, portalCode: storeCode });
  }

  return contentPageCode ? getPreviewContentPageDetails({ contentPageCode, portalCode: storeCode }) : getPreviewPageDetails({ pageCode, portalCode: storeCode });
}

async function getPageData(pageCode: string, contentPageCode: string, storeCode: string, publishState: string): Promise<Data> {
  const result = await fetchProductionOrPreviewPageStructure(pageCode, contentPageCode, storeCode, publishState);
  return result?.data || defaultData;
}

export async function getServerPageStructure(
  pageCode: string,
  contentPageCode: string,
  storeCode: string,
  publishState: string,
  publicId: string,
  pageVariant: IPageVariant,
  hasDefaultPageStructure: boolean
): Promise<INullablePageStructure> {
  try {
    let data: Data = { ...defaultData };
    let headerData: Data = { ...defaultData };
    let footerData: Data = { ...defaultData };

    if (hasMainContent(pageVariant, publicId)) {
      data = hasDefaultPageStructure ? defaultData : await getPageData(pageCode ?? "", contentPageCode ?? "", storeCode ?? "", publishState);
    }

    if (hasHeader(pageVariant)) {
      const pageCode = PAGE_CONSTANTS.PAGE_CODES.HEADER;
      const contentPageCode = "";
      const headerJson = await getPageData(pageCode ?? "", contentPageCode, storeCode ?? "", publishState);

      if (hasNotAllOrLayout(pageVariant)) {
        data = headerJson;
      } else {
        headerData = headerJson;
      }
    }

    if (hasFooter(pageVariant)) {
      const pageCode = PAGE_CONSTANTS.PAGE_CODES.FOOTER;
      const contentPageCode = "";
      const footerJson = await getPageData(pageCode ?? "", contentPageCode, storeCode ?? "", publishState);

      if (hasNotAllOrLayout(pageVariant)) {
        data = footerJson;
      } else {
        footerData = footerJson;
      }
    }

    return createPageStructure(publicId, data, headerData, footerData);
  } catch (error) {
    console.log("Error getting", error);
  }

  return null;
}

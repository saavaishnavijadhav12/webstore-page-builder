import { getContentContainer } from "@znode/agents/content-container";
import { getBrandDetails, getBrandList } from "@znode/agents/brand";
import { categories, getLinkData, getOfferBannerData, getSliderData } from "@znode/agents/widget";
import { getPortalHeader } from "@znode/utils/server";
import { getBlogDetail, getBlogList } from "@znode/agents/blogs";
import { categoryProductList } from "@znode/agents/category-product-list";
import { getPortalData, getProductInformation, getProductWidgetList } from "@znode/agents/product";
import type { Data } from "@measured/puck";
import { getCatalogCode } from "@znode/agents/category";
import { getHeaderInitialDetails } from "@znode/agents/headers";
import { IPageVariant } from "./get-page";
import { ILayoutHandler, ILayoutHandlersMap, IPageHandler, IPageHandlersMap, IWidgetHandler, IWidgetHandlersMap } from "../types/page-builder";
import { PAGE_CONSTANTS } from "@znode/page-builder/page-constant";

export async function preparedContentItem(data: Data, id: string | null, searchParams: any, contentPageId?: number, pageVariant?: IPageVariant): Promise<Data> {
  const preparedData: Data = JSON.parse(JSON.stringify(data));
  try {
    const content = preparedData.content;
    const zones = preparedData?.zones;
    const portalHeader = await getPortalHeader();
    const portalId = portalHeader.portalId;
    const portalData = await getPortalData();
    const publishCatalogCode = await getCatalogCode(portalData);
    const sharedPortalParams = {
      portalId,
      localeId: portalHeader.localeId,
      localeCode: portalHeader.localeCode,
      storeCode: portalHeader.storeCode,
      catalogCode: publishCatalogCode,
    };

    await Promise.all(
      content.map(async (item) => {
        const config = item.props?.config;
        if (!config) return;

        item.props.response = {
          data: await fetchPageAndContentData(JSON.parse(JSON.stringify(config)), id, searchParams, JSON.parse(JSON.stringify(sharedPortalParams)), contentPageId, pageVariant),
        };
      })
    );

    if (typeof zones === "object" && zones !== null) {
      let flatZones: Data["content"] = [];
      Object.entries(zones).forEach(([, value]) => {
        flatZones = flatZones.concat(value.flat());
      });
      await Promise.all(
        flatZones.map(async (item) => {
          const config = item.props?.config;
          if (!config) return;

          item.props.response = {
            data: await fetchPageAndContentData(JSON.parse(JSON.stringify(config)), id, searchParams, JSON.parse(JSON.stringify(sharedPortalParams)), contentPageId, pageVariant),
          };
        })
      );
    }
  } catch (error) {
    console.error("Error preparing content item:", error);
  }

  return preparedData;
}

const pageHandlers: IPageHandlersMap = new Map<string, IPageHandler>([
  ["BrandListPage", async (_, searchParams) => await getBrandList(searchParams)],
  ["BrandDetailsPage", async (id) => await getBrandDetails(id || "")],
  ["BlogsPage", async () => await getBlogList()],
  ["BlogDetailsPage", async (id) => await getBlogDetail(id || "")],
  ["ProductListPage", async (id, searchParams) => await categoryProductList(Number(id), searchParams)],
  ["ProductDetailsPage", async (id, searchParams) => await getProductInformation(Number(id), searchParams)],
]);

const widgetHandlers: IWidgetHandlersMap = new Map<string, IWidgetHandler>([
  ["BannerSliderWidget", async (params) => await getSliderData(params)],
  ["OfferBannerWidget", async (params) => await getOfferBannerData(params)],
  ["CategoriesWidget", async (params) => await categories(params)],
  ["ProductsCarouselWidget", async (params) => await getProductWidgetList(params)],
  ["AdSpaceWidget", async (params) => await getContentContainer(params)],
  ["HomePagePromoWidget", async (params) => await getContentContainer(params)],
  ["LinkPanelWidget", async (params) => await getLinkData(params)],
  ["TickerWidget", async (params) => await getContentContainer(params)],
]);

const layoutHandlers: ILayoutHandlersMap = new Map<string, ILayoutHandler>([
  [
    "HeaderLayout",
    async () => {
      const { configuration, headerDetails } = await getHeaderInitialDetails();
      const { categories, isUserLoggedIn, portalLocales, analyticsInfo, cartCount } = headerDetails;
      return {
        headerConfig: configuration,
        categories: categories,
        isUserLoggedIn: isUserLoggedIn,
        portalLocales: portalLocales,
        analyticsInfo: analyticsInfo,
        cartCount: cartCount,
      };
    },
  ],
]);

async function fetchPageAndContentData(
  config: { id: string; type: string; widgetConfig?: any },
  id: string | null,
  searchParams: any,
  sharedParams: any,
  contentPageId?: number,
  pageVariant?: IPageVariant
) {
  try {
    const handler = getHandler(config);
    if (!handler) return null;

    if (config.type === PAGE_CONSTANTS.GENERAL.PAGE) {
      return await handler(id, searchParams);
    }

    if (config.type === PAGE_CONSTANTS.GENERAL.WIDGET && config.widgetConfig) {
      configureWidgetParams(config, sharedParams, contentPageId, pageVariant);
      const widgetParams = { ...sharedParams, ...config.widgetConfig };
      return await handler(widgetParams);
    }

    if (config.type === PAGE_CONSTANTS.GENERAL.LAYOUT) {
      return await (handler as ILayoutHandler)();
    }

    return null;
  } catch (error) {
    console.log(`Error fetching ${config.type} data for ${config.id}:`, error);
    return null;
  }
}

function getHandler(config: { id: string; type: string }) {
  if (config.type === PAGE_CONSTANTS.GENERAL.PAGE && pageHandlers.has(config.id)) {
    return pageHandlers.get(config.id);
  }
  if (config.type === PAGE_CONSTANTS.GENERAL.WIDGET && widgetHandlers.has(config.id)) {
    return widgetHandlers.get(config.id);
  }
  if (config.type === PAGE_CONSTANTS.GENERAL.LAYOUT && layoutHandlers.has(config.id)) {
    return layoutHandlers.get(config.id);
  }
  return null;
}

function configureWidgetParams(config: { id: string; type: string; widgetConfig?: any }, sharedParams: any, contentPageId?: number, pageVariant?: IPageVariant) {
  if (contentPageId && pageVariant !== PAGE_CONSTANTS.GENERAL.LAYOUT) {
    config.widgetConfig.typeOfMapping = "ContentPageMapping";
    config.widgetConfig.cmsMappingId = contentPageId;
    sharedParams.portalId = contentPageId;
  } else {
    config.widgetConfig.typeOfMapping = "PortalMapping";
    config.widgetConfig.cmsMappingId = sharedParams.portalId;
  }
}

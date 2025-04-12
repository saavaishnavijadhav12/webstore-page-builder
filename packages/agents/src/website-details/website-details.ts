import { FilterTuple, WebSite_logoDetailsByStoreCode } from "@znode/clients/v2";
import { CACHE_KEYS } from "@znode/constants/cache-keys";
import { AREA, errorStack, logServer } from "@znode/logger/server";
import { FilterCollection, FilterKeys, FilterOperators, generateTagName } from "@znode/utils/server";


/**
 * Fetches the dynamic theme CSS for a given portal.
 * @param portalId - The ID of the portal for which to fetch the theme.
 * @returns A promise that resolves to the dynamic CSS style or default theme colors.
 */

export const THEME_COLORS = `:root {
    --primary: #000000;
    --secondary: #ffffff;
    --primary-btn-bg: #000000;
    --secondary-btn-bg: #ffffff;
    --primary-btn-text: #ffffff;
    --secondary-btn-text: #000000;
    --btn-border: #000000;
    --btn-border-radius: 0.25rem;
    --header-bg: #ffffff;
    --footer-bg: #000000;
    --footer-primary-text: #FFFFFF;
    --footer-secondary-text: #FFFFFF;
    --navigation-bar-bg: #f3f4f6;
    --navigation-text: #605458;
    --link: #1e40af;
    --hover: #3b82f6;
    --success: #22c55e;
    --error: #ef4444;
    --border-color: #9ca3af;
    --breadcrumbs-text: #9a9a9a;
    --card-radius: 0.25rem;
    --card-border: #e2e8f0;
    --input-radius: 0.25rem;
    --input-border: #d3d3d3;
    --separator: #9ca3af;
    --accent: #000000;
    --widget-edit-bar: #5db043;
  }`;


export async function getStoreCSS(storeCode: string): Promise<string> {
  try {
    const cacheInvalidator = new FilterCollection();
    cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}, ${CACHE_KEYS.DYNAMIC_TAG}`, storeCode || "", "LogoDetailsByStoreCode"));
    const webSiteLogo  = await WebSite_logoDetailsByStoreCode(storeCode, cacheInvalidator.filterTupleArray as FilterTuple[]);
    const dynamicCss = webSiteLogo?.DynamicContent?.DynamicCssStyle ?? THEME_COLORS;
    return dynamicCss;
  } catch (error) {
    logServer.error(AREA.WEBSITE, errorStack(error));
    return THEME_COLORS;
  }
}

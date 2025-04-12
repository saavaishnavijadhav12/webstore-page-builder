import { APP, APP_NAME } from "@znode/constants/app";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AREA, errorStack, logServer } from "@znode/logger/server";
import { IPortalDetail, IPortalLocale } from "@znode/types/portal";

import { HEADERS } from "@znode/constants/headers";
import { convertCamelCase } from "../convert-case";
import { generateDomainBasedToken } from "../authentication/domain-authentication";
import { REQUIRED_PORTAL_KEYS, AVAILABLE_THEME_NAME, REQUIRED_DOMAIN_KEYS, DEFAULT_THEME_COLORS } from "./utils";
let globalPortalCache = new Map();
export async function getSpecificData(domainNameOrStoreCode: string, type?: string) {
  switch (type) {
    case "metaData": {
      let metaData = getDataFromGlobalCache(`MetaData_${domainNameOrStoreCode}`);
      if (!metaData) {
        metaData = await getCurrentPortal(domainNameOrStoreCode);
        return metaData;
      }
      return metaData;
    }

    case "themeData": {
      let themeData = getDataFromGlobalCache(`Theme_${domainNameOrStoreCode}`);
      if (!themeData) {
        themeData = await getCurrentPortal(domainNameOrStoreCode);
        return themeData;
      }
      return themeData;
    }

    default: {
      let portalDataStore = getDataFromGlobalCache(`Portal_${domainNameOrStoreCode}`);
      if (!portalDataStore) {
        portalDataStore = await getCurrentPortal(domainNameOrStoreCode);
      }
      if (portalDataStore && portalDataStore.hasError) {
        return portalDataStore;
      }
      return portalDataStore;
    }
  }
}

export async function getPortalDataFromGlobalCache(domainNameOrStoreCode: string, type?: string) {
  return await getSpecificData(domainNameOrStoreCode, type);
}

export function checkRedirectUrl(urlRedirectionData: any[], url: string) {
  if (urlRedirectionData && urlRedirectionData.length > 0) {
    const isRedirectionAllowed = urlRedirectionData.find((path: { redirectTo: string; redirectFrom: string }) => `/${path.redirectFrom}` === url);
    url = isRedirectionAllowed?.redirectTo || "";
    if (url && url !== "") {
      return url;
    } else {
      return null;
    }
  } else return null;
}

export async function filterActiveRedirects(redirectionUrlList: any[]) {
  if (redirectionUrlList && redirectionUrlList.length == 0) {
    return [];
  }
  return redirectionUrlList.reduce((result: any[], { RedirectFrom, RedirectTo, IsActive }) => {
    if (IsActive) result.push({ redirectFrom: RedirectFrom, redirectTo: RedirectTo, isActive: IsActive } as any);
    return result;
  }, []);
}

export async function getRedirectionDataFromGlobalCache(portalId: number, pathname: string, domainNameOrStoreCode: string) {
  let redirectionUrlStore = getDataFromGlobalCache(`RedirectionUrl_${domainNameOrStoreCode}`);
  if (!redirectionUrlStore) {
    try {
      const apiUrl = `${APP.BASE_URL}v2/redirect-urls?filter=PortalId~eq~${portalId}`;
      const redirectionUrlResponse = await fetch(apiUrl, getRequestHeaders());
      const redirectionUrlFormattedResponse = await redirectionUrlResponse.json();
      if (!redirectionUrlFormattedResponse?.HasError) {
        redirectionUrlStore = await filterActiveRedirects(redirectionUrlFormattedResponse.UrlRedirectList ?? []);
        redirectionUrlStore && setDataInGlobalCache(`RedirectionUrl_${domainNameOrStoreCode}`, redirectionUrlStore);
        return checkRedirectUrl(redirectionUrlStore, pathname);
      }
    } catch (error: any) {
      return redirectionUrlStore;
    }
  } else {
    return checkRedirectUrl(redirectionUrlStore, pathname);
  }
}

export function getDefaultLocale(portalLocals: IPortalLocale[]) {
  const formattedPortalLocaleResponse = convertCamelCase(portalLocals);
  const defaultPortalLocale = formattedPortalLocaleResponse.find((val: IPortalLocale) => val?.isDefault === true);
  return defaultPortalLocale?.code;
}

function setDataInGlobalCache(key: string, value: any | null) {
  key && value && globalPortalCache.set(key, value);
}

export function clearDataInGlobalCache() {
  globalPortalCache = new Map();
}

export function clearDataInGlobalCacheByKey(key: string) {
  key && globalPortalCache.delete(key);
}

export function checkThemeExist(name: string) {
  return AVAILABLE_THEME_NAME.includes(name);
}

function getDataFromGlobalCache(key: string) {
  return globalPortalCache.get(key);
}

function throwExceptions(response: { hasError: boolean; message: string | undefined }) {
  if (response && response.hasError) {
    throw Error(response.message);
  }
}

async function getDynamicCSS(storeCode: string) {
  try {
    const apiUrl = `${APP.BASE_URL}v2/websites/${storeCode}/logo-details`;
    const themeResponse = await fetch(apiUrl, getRequestHeaders());
    const formattedThemeResponse = await themeResponse.json();
    const themeData = formattedThemeResponse?.DynamicContent?.DynamicCssStyle;
    return themeData ? themeData : DEFAULT_THEME_COLORS;
  } catch (e) {
    return DEFAULT_THEME_COLORS;
  }
}

const getCurrentPortal = async (domainOrStoreCode: string) => {
  const portalAPIRequestInstance = globalPortalCache.get(`portalAPIRequestInstance_${domainOrStoreCode}`);
  if (portalAPIRequestInstance) {
    return portalAPIRequestInstance;
  }
  const portalDataPromise = (async () => {
    const appName = process.env.APP_NAME;
    try {
      const domainDetails = await getCurrentDomain(domainOrStoreCode, appName || "");
      (process.env.NODE_ENV == "development" || appName == APP_NAME.PAGE_BUILDER) && throwExceptions(domainDetails);
      REQUIRED_DOMAIN_KEYS.forEach((key) => {
        if (domainDetails[key] === undefined) {
          logServer.error(AREA.LAUNCHING_ERROR, `Few issue found while retrieving domain list data ${key}`);
        }
      });
      const apiUrl = `${APP.BASE_URL}v2/portals/${domainDetails.StoreCode}/application/${domainDetails.ApplicationType}`;
      const portalResponse = await fetch(apiUrl, getRequestHeaders());
      const formattedPortalResponse = await portalResponse.json();
      const clonedResponse = JSON.stringify(formattedPortalResponse);
      const portalDetails = JSON.parse(clonedResponse);
      if ((!portalDetails || portalDetails.errorMessage) && process.env.NODE_ENV == "development") {
        const portalResponseBody = { responseData: null, hasError: true, message: "Portals details api not working on startup" };
        throwExceptions(portalResponseBody);
      }
      const portalData: IPortalDetail = {
        portalId: portalDetails.PortalId || 0,
        localeId: portalDetails.LocaleId || 0,
        publishState: portalDetails.PublishState,
        publishCatalogId: portalDetails.PublishCatalogId || 0,
        localeCode: getDefaultLocale(portalDetails.PortalLocales),
        publishCatalogCode: portalDetails.CatalogCode,
        storeCode: portalDetails.StoreCode,
        themeName: portalDetails.ThemeName,
        loginRequired: getLoginRequiredFlag(portalDetails),
      };
      const metaData = {
        websiteTitle: portalDetails?.WebsiteTitle,
        websiteDescription: portalDetails?.WebsiteDescription,
        mediaServerUrl: portalDetails?.MediaServerUrl,
        faviconImage: portalDetails?.FaviconImage,
        defaultRobotTag: portalDetails?.DefaultRobotTag,
      };
      if (appName == APP_NAME.PAGE_BUILDER) {
        portalData.hostname = domainDetails.DomainName;
      }
      REQUIRED_PORTAL_KEYS.forEach((key) => {
        if (portalDetails[key] === undefined) {
          logServer.error(AREA.LAUNCHING_ERROR, `Few issue found while retrieving portal data ${JSON.stringify(portalData)}`);
        }
      });
      const themeData = await getDynamicCSS(domainDetails.StoreCode);
      if (portalData) {
        setDataInGlobalCache(`Portal_${domainOrStoreCode}`, portalData);
        setDataInGlobalCache(`MetaData_${domainOrStoreCode}`, metaData);
        setDataInGlobalCache(`Theme_${domainOrStoreCode}`, themeData);
      }
      return portalData;
    } catch (error: any) {
      logServer.error(AREA.LAUNCHING_ERROR, errorStack(error));
      clearDataInGlobalCacheByKey(`portalAPIRequestInstance_${domainOrStoreCode}`);
      return error && error.message && (process.env.NODE_ENV == "development" || (appName == APP_NAME.PAGE_BUILDER))? { hasError: true, message: error.message } : null;
    }
  })();
  globalPortalCache.set(`portalAPIRequestInstance_${domainOrStoreCode}`, portalDataPromise);
  return portalDataPromise;
};


export const getLoginRequiredFlag = (currentPortal: any) => {
  let isLoginRequired = false;
  const loginRequiredAttribute = currentPortal?.GlobalAttributes?.Attributes?.find((x: any) => x.AttributeCode === "LoginRequired");
  if (loginRequiredAttribute) {
    isLoginRequired = loginRequiredAttribute?.AttributeValue === "true" ? true : false;
  }
  return isLoginRequired;
};


/**
 * Get domain list.
 * @returns domain list.
 */

const getErrorResponseBasedOnApp = async (isRequestFromPageBuilder: boolean) => {
let message = process.env.NODE_ENV == "development" ? { responseData: null, hasError: true, message: "Domain details api not working on startup" } : null;
if(isRequestFromPageBuilder) {
  message = { responseData: null, hasError: true, message: "Preview is not published" };
}
return message;
};

const getCurrentDomain = async (domainURL: string, appName: string) => {
  const isRequestFromPageBuilder = (appName == APP_NAME.PAGE_BUILDER) ? true : false;
  try {
    let filter = `?filter=domainname~eq~"${domainURL}"`;
    if(isRequestFromPageBuilder)
    {
      filter =  `?pageIndex=1&pageSize=10&filter=StoreCode~eq~${domainURL},isactive~eq~true,isdefault~eq~true,ApplicationType~eq~"WebstorePreview"`;
    }
    const domainList = `${APP.BASE_URL}v2/domains${filter}`;
    const domainResponse = await fetch(domainList, getRequestHeaders());
    if (domainResponse.status === 204 && isRequestFromPageBuilder) {
      throw Error("Page builder preview is not published");
    }
    const formattedDomainResponse = await domainResponse.json();

    return formattedDomainResponse.Domains.at(0);
  } catch (error) {
    logServer.error(AREA.LAUNCHING_ERROR, errorStack(error));
    return await getErrorResponseBasedOnApp(isRequestFromPageBuilder);
  }
};

const getRequestHeaders = () => {
  const headers: HeadersInit = new Headers();
  headers.set(HEADERS.AUTHORIZATION, "basic " + generateDomainBasedToken());
  const reqHeaders: RequestInit = {
    headers: headers,
  };
  return reqHeaders;
};

import { AREA, errorStack, logServer } from "@znode/logger/server";
import { ApplicationTypesEnum, ZnodePublishStatesEnum } from "@znode/types/enums";
import { Domains_domains, Portals_robotsTxtByStoreCode, WebStorePortals_applicationByStoreCode } from "@znode/clients/v2";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterCollection, FilterKeys, FilterOperators, convertCamelCase, generateCacheKey, generateTagName, getPortalHeader } from "@znode/utils/server";
import { FilterTuple } from "@znode/clients/v1";
import { APP } from "@znode/constants/app";
import { CACHE_KEYS } from "@znode/constants/cache-keys";
import { IPortalDetail, ISchemaDetails } from "@znode/types/portal";
import { mapPortalApplicationValues } from "./mapper";


export function mapRequiredPortalValues(portalData: any, properties: []): any {
  const result: any = {};

  properties.forEach((property: any) => {
    if (typeof property === "string") {
      result[property] = portalData[property];
    } else if (property.key && property.value) {
      const nestedAttribute = portalData?.GlobalAttributes?.Attributes?.find((attr: { AttributeCode: any }) => attr.AttributeCode === property.value);
      if (nestedAttribute) {
        result[property.value] = nestedAttribute?.AttributeValue;
      }
    }
  });
  return convertCamelCase(result);
}

export async function getRobotsTxt(storeCode: string) {
  const cacheInvalidator = new FilterCollection();
  cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}, ${CACHE_KEYS.DYNAMIC_TAG}`, storeCode as string, "RobotsTxtByStoreCode"));
  const robotsTxtDetails = await Portals_robotsTxtByStoreCode(storeCode, undefined, cacheInvalidator.filterTupleArray as FilterTuple[]);
  if (robotsTxtDetails !== null || robotsTxtDetails !== undefined) {
    const robotText = robotsTxtDetails && robotsTxtDetails?.RobotsTxtContent;
    return robotText;
  } else return "";
}

export async function getMetaData() {
  const metaData = await getPortalDetails();
  if (metaData !== null || metaData !== undefined) {
    const { websiteTitle, websiteDescription, mediaServerUrl, faviconImage, defaultRobotTag } = metaData;
    const metaInfo = {
      websiteTitle,
      websiteDescription,
      mediaServerUrl,
      faviconImage,
      defaultRobotTag,
    };
    return metaInfo;
  } else return null;
}

export async function getPortalDetails(requiredProperties?: any): Promise<IPortalDetail> {
  try {
    const domainName = APP.WEBSTORE_DOMAIN_NAME;
    const portalHeaders = await getPortalHeader();
    let storeCode = portalHeaders.storeCode;
    if (portalHeaders.storeCode === "" || portalHeaders.storeCode === undefined) {
      const filters = new FilterCollection();
      filters.add(FilterKeys.DomainName, FilterOperators.Contains, String(domainName));
      const cacheInvalidator = new FilterCollection();
      cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateCacheKey(CACHE_KEYS.DOMAIN_LIST));
      cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}, ${CACHE_KEYS.DYNAMIC_TAG}`, storeCode, "Domains_domains"));
      const domainList = await Domains_domains(filters.filterTupleArray as FilterTuple[], undefined, undefined, undefined, cacheInvalidator.filterTupleArray as FilterTuple[]);
      storeCode = (domainList?.Domains && domainList?.Domains[0]?.StoreCode) || "";
    }
    let applicationType;
    applicationType = ApplicationTypesEnum.WebStore;
    if (portalHeaders.publishState === ZnodePublishStatesEnum.Preview) {
      applicationType = ApplicationTypesEnum.WebstorePreview;
    }

    if (storeCode && storeCode !== "") {
      const cacheInvalidator = new FilterCollection();
      cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}, ${CACHE_KEYS.DYNAMIC_TAG}`, storeCode, "PortalApplicationByStoreCode"));
      const portalData = await WebStorePortals_applicationByStoreCode(
        storeCode,
        Number(applicationType),
        portalHeaders.localeCode,
        cacheInvalidator.filterTupleArray as FilterTuple[]
      );
      if (requiredProperties) {
        return mapRequiredPortalValues(portalData, requiredProperties);
      }
      return mapPortalApplicationValues(portalData);
    } else return {} as IPortalDetail;
  } catch (error) {
    logServer.error(AREA.PORTAL, errorStack(error));
    return {} as IPortalDetail;
  }
}

export async function getSchemaDetails() {
  const schemaDetails = await getPortalDetails();
  if (schemaDetails) {
    const { storeName, websiteLogo, customerServicePhoneNumber, customerServiceEmail } = schemaDetails;
    const schemaInfo = {
      storeName,
      websiteLogo,
      customerServicePhoneNumber,
      customerServiceEmail,
    } as ISchemaDetails;
    return schemaInfo;
  }
  return {} as ISchemaDetails;
}

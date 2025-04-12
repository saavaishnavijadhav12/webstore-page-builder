/* eslint-disable @typescript-eslint/no-explicit-any */
import { AREA, errorStack, logServer } from "@znode/logger/server";
import { BrandListModelResponse, BrandModelResponse } from "packages/clients/src/znode-client/V2/multifront-types";
import { FilterCollection, FilterKeys, FilterOperators, convertCamelCase, generateTagName, getPortalHeader } from "@znode/utils/server";
import { PublishBrands_publishedBrandsGet, PublishBrands_publishedBrandsGetByBrandCode } from "@znode/clients/v2";

import { CACHE_KEYS } from "@znode/constants/cache-keys";
import { FilterTuple } from "@znode/clients/v1";
import { IBrandDetailResponse } from "@znode/types/brand";
import { IFilterTuple } from "@znode/types/filter";
import { getPortalDetails } from "../portal/portal";

/**
 * Get Filtered Brand List by Brand Name.
 * @param brandName - The brand name to filter.
 * @param portalData - Portal details.
 * @param publishCatalogId - Catalog ID for filtering (optional).
 * @param cmsMappingId - CMS mapping ID for filtering (optional).
 * @param localeId - Locale ID for filtering (optional).
 * @returns A list of brands or null.
 */
export async function getBrandList(params?: { brandName: string }): Promise<{ id: number; name: string; code: string; img: string }[] | []> {
  try {
    const { brandName = "" } = params || {};
    const portalHeader = await getPortalHeader();
    const filters: IFilterTuple[] = getBrandFilters(brandName, portalHeader.localeId, portalHeader.portalId);
    const sort = { displayOrder: "ASC" };
    const cacheInvalidator = new FilterCollection();
    cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}, ${CACHE_KEYS.DYNAMIC_TAG}`, portalHeader.storeCode || "", "PublishedBrandsGet"));
    const brandListResponse: BrandListModelResponse = await PublishBrands_publishedBrandsGet(filters as FilterTuple[], sort, cacheInvalidator.filterTupleArray as FilterTuple[]);
    return (
      brandListResponse?.Brands?.map(({ BrandId, BrandName, BrandCode, ImageSmallPath, SEOFriendlyPageName, SEOTitle }: BrandModelResponse) => {
        if (BrandId && BrandName) {
          return {
            id: BrandId,
            name: BrandName,
            code: BrandCode,
            img: ImageSmallPath ?? "",
            seoUrl: SEOFriendlyPageName,
            seoTitle: SEOTitle,
          };
        }
        return null;
      }).filter((brand): brand is { id: number; name: string; code: string; img: string; seoUrl: string; seoTitle: string } => brand !== null) ?? []
    );
  } catch (error) {
    logServer.error(AREA.BRAND, errorStack(error));
    return [];
  }
}

/**
 * Get brand details by brand ID.
 * @param brandId - The ID of the brand.
 * @param portalData - Portal details.
 * @returns Brand details.
 */
export async function getBrandDetails(brandCode: string): Promise<IBrandDetailResponse> {
  try {
    const portalData = await getPortalDetails();
    const storeCode = portalData.storeCode;
    const localeCode = portalData.portalLocales && portalData.portalLocales.at(0)?.code;
    const cacheInvalidator = new FilterCollection();
    cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.BRAND_CODE}, ${CACHE_KEYS.DYNAMIC_TAG}`, brandCode, "PublishedBrandsGetByBrandCode"));
    const brandDetails = await PublishBrands_publishedBrandsGetByBrandCode(brandCode, localeCode ?? "en-Us", storeCode ?? "", cacheInvalidator.filterTupleArray as FilterTuple[]);
    return convertCamelCase(brandDetails);
  } catch (error) {
    logServer.error(AREA.BRAND, errorStack(error));
    return { brands: { brandName: "", brandCode: "" } } as IBrandDetailResponse;
  }
}

/**
 * Get filters for brand products.
 * @param brandName - The name of the brand for filtering (optional).
 * @param cmsMappingId - CMS mapping ID for filtering (optional).
 * @param portalId - Portal ID for filtering (optional).
 * @param publishCatalogId - Catalog ID for filtering (optional).
 * @param localeId - Locale ID for filtering (optional).
 * @returns An array of filter tuples.
 */
export function getBrandFilters(brandName?: string, localeId?: number, portalId?: number, publishCatalogId?: number, cmsMappingId?: number): IFilterTuple[] {
  const filters: FilterCollection = new FilterCollection();

  // Add filters based on the parameters provided
  if (brandName !== undefined) {
    filters.add(FilterKeys.BrandName, FilterOperators.StartsWith, brandName);
  }

  if (publishCatalogId) {
    filters.add(FilterKeys.ZnodeCatalogId, FilterOperators.Equals, publishCatalogId.toString());
  }

  if (localeId) {
    filters.add(FilterKeys.LocaleId, FilterOperators.Equals, localeId.toString());
  }

  if (portalId) {
    filters.add(FilterKeys.PortalId, FilterOperators.Equals, portalId.toString());
  }

  if (cmsMappingId) {
    filters.add("ZnodeCategoryId", FilterOperators.Equals, cmsMappingId.toString());
  }

  // Add the IsActive filter as it's a constant value
  filters.add(FilterKeys.IsActive, FilterOperators.Equals, "true");

  return filters.filterTupleArray;
}

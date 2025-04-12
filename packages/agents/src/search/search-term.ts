import { AREA, errorStack, logServer } from "@znode/logger/server";
import { ExpandCollection, convertCamelCase } from "@znode/utils/server";
import { FilterTuple, Searches_fullTextSearchBySearchKeyword } from "@znode/clients/v2";
import { IProductListRequest, IPromotion } from "@znode/types/product";
import { ISearchReportModel, ISearchResponse, ISearchTerm } from "@znode/types/search-term";
import { getAttributeValue, getSavedUserSession, stringToBooleanV2 } from "@znode/utils/common";
import { getCatalogCode, getCategoryExpands, getCategoryFilters, getCategoryList } from "../category";
import { getFacetFilter, getSortByProductList } from "../product";

import { APP } from "@znode/constants/app";
import { IAttributeDetails } from "@znode/types/attribute";
import { ICategory } from "@znode/types/category";
import { IFacets } from "@znode/types/facet";
import { IFilterTuple } from "@znode/types/filter";
import { INVENTORY } from "@znode/constants/inventory";
import { IPortalDetail } from "@znode/types/portal";
import { ISearchCMSPages } from "@znode/types/keyword-search";
import { ISearchParams } from "@znode/types/search-params";
import { IUser } from "@znode/types/user";
import { PRODUCT } from "@znode/constants/product";
import { SearchReports_searchReport } from "@znode/clients/v2";
import { fullTextContentPageSearch } from "./search";
import { getFilteredProductData } from "./search-mapper";
import { getPortalDetails } from "../portal";
import { getUserCatalogId } from "../user";
import { mapPromotionValues } from "../product/mapper";

// Get search result on the basis of searchTerm.
export async function getSearchResult(searchParams: ISearchParams): Promise<ISearchTerm | null> {
  try {
    const portalData: IPortalDetail = await getPortalDetails();
    const expand: ExpandCollection = await getCategoryExpands();
    const isGetAllLocationsInventory = portalData?.globalAttributes?.find((a) => a.attributeCode === INVENTORY.DISPLAY_ALL_WAREHOUSES_STOCK)?.attributeValue ?? "";
    const userData = await getSavedUserSession();
    const isLoginRequiredForPricingAndInventory =
      portalData.globalAttributes &&
      portalData.globalAttributes.find((a) => a.attributeCode?.toLowerCase() === PRODUCT.LOGIN_TO_SEE_PRICING_AND_INVENTORY.toLowerCase())?.attributeValue;
    const displayAllWarehousesStock =
      portalData.globalAttributes && portalData.globalAttributes.find((a) => a.attributeCode?.toLowerCase() === PRODUCT.DISPLAY_ALL_WAREHOUSES_STOCK.toLowerCase())?.attributeValue;
    const { portalId, localeId, publishCatalogId, profileId, portalProfileCatalogId, portalFeatureValues } = portalData || {};
    const userCatalogId = await getUserCatalogId(publishCatalogId, portalProfileCatalogId, profileId, portalFeatureValues, userData || {});
    const filters: IFilterTuple[] = await getCategoryFilters(portalId, localeId, userCatalogId || 0, isGetAllLocationsInventory);
    const productListModel: IProductListRequest = await bindSearchModel(userCatalogId || 0, searchParams, portalData);
    const productList: ISearchResponse = (await getSearchedProducts(expand, filters, productListModel, searchParams, portalData)) || {};
    saveSearchReportData(searchParams?.searchTerm, portalData, productList, userData || {});
    const isEnableCMSPageSearch = portalData.portalFeatureValues?.enableCMSPageResults;
    const searchCMSPagesData = isEnableCMSPageSearch
      ? await fullTextContentPageSearch(searchParams, filters, portalData?.storeCode, portalData?.localeCode)
      : { cmsPages: [], totalCMSPageCount: 0 };
    productList.sortList = portalData.sortList;
    productList.pageList = portalData.pageList;
    if (productList.hasError) {
      const filteredProductData = {
        productList: [],
        totalProducts: 0,
        searchProfileId: null,
        totalCmsPages: 0,
        pageNumber: null,
        pageSize: null,
      };
      return {
        filteredProductData: filteredProductData,
        associatedCategoryList: [],
        filteredAttribute: [],
        searchCMSPagesData: searchCMSPagesData as ISearchCMSPages,
        enableCMSPageSearch: isEnableCMSPageSearch || false,
        isEnableCompare:portalData.enableCompare,
      } as ISearchTerm;
    }
    return await bindCategoryFacet(
      productList,
      true,
      portalData.portalId,
      portalData.localeId,
      userCatalogId || 0,
      searchCMSPagesData,
      isEnableCMSPageSearch || false,
      isLoginRequiredForPricingAndInventory,
      displayAllWarehousesStock,
      portalData.enableCompare
    );
  } catch (error) {
    logServer.error(AREA.SEARCH, errorStack(error));
    return null;
  }
}

//bind the search parameters.
export async function bindSearchModel(catalogId: number, searchParams: ISearchParams, portalData: IPortalDetail): Promise<IProductListRequest> {
  const pageValue: number = portalData.pageList?.find((m) => m.isDefault === true)?.pageValue ?? 16;

  const productListModel: IProductListRequest = {
    PageNumber: Number(searchParams?.pageNumber) || 1,
    PageIndex: Number(searchParams?.pageIndex) || 1,
    PageSize: Number(searchParams?.pageSize) || pageValue,
    CatalogId: catalogId,
    IsFacetList: true,
    Keyword: searchParams?.searchTerm,
    LocaleId: portalData?.localeId,
    PortalId: portalData?.portalId,
    RefineBy: await getFacetFilter(searchParams),
    UseSuggestion: true,
    IsProductInheritanceEnabled: portalData?.portalFeatureValues?.enableProductInheritance,
  };

  return productListModel;
}

export async function bindCategoryFacet(
  searchResult: ISearchResponse,
  isAssociatedCategoryRequired: boolean,
  portalId: number,
  localeId: number,
  catalogId: number,
  searchCMSPagesData: ISearchCMSPages,
  isEnableCMSPageSearch?: boolean,
  loginToSeePricingAndInventory?: string,
  displayAllWarehousesStock?: string,
  isEnableCompare?: boolean
) {
  if (isAssociatedCategoryRequired) {
    if (searchResult?.associatedCategoryIds && searchResult?.associatedCategoryIds?.length > 0) {
      await getAssociatedCategoryList(searchResult, portalId, localeId, catalogId);
    }
  }

  const getCategoryData = (categoryList: ICategory[]) => {
    const categoryData = categoryList.map((category: ICategory) => ({
      categoryCode: category?.categoryCode,
      name: category?.name,
      publishCategoryId: category?.publishCategoryId,
      subCategories: category.subCategories || [],
    }));
    return categoryData;
  };

  const filteredProductList = getFilteredProductData(searchResult);
  const associatedCategoryList =
    searchResult?.associatedCategoryList && searchResult.associatedCategoryList.length > 0 ? getCategoryData(searchResult?.associatedCategoryList as ICategory[]) : [];
  const filteredAttribute =
    searchResult.facets && searchResult?.facets.length > 0
      ? searchResult?.facets.map((val: IFacets) => {
          return { attributeValues: val?.attributeValues, attributeName: val?.attributeName, attributeCode: val?.attributeCode };
        })
      : [];

  return {
    filteredProductData: { ...filteredProductList, loginToSeePricingAndInventory, displayAllWarehousesStock },
    associatedCategoryList,
    filteredAttribute,
    enableCMSPageSearch: isEnableCMSPageSearch,
    searchCMSPagesData: searchCMSPagesData as ISearchCMSPages,
    isEnableCompare
  } as ISearchTerm;
}

export async function getAssociatedCategoryList(searchResult: ISearchResponse, portalId: number, localeId: number, catalogId: number) {
  const parentCategories: ICategory[] = await getCategories(portalId, localeId, catalogId);
  const categoryHeaderViewModelList: ICategory[] = [];

  parentCategories &&
    parentCategories.length > 0 &&
    parentCategories.forEach((parentCategory) => {
      if (searchResult?.associatedCategoryIds?.includes(parentCategory.publishCategoryId)) categoryHeaderViewModelList.push(parentCategory);
      parentCategory?.subCategories?.forEach((subCategory: ICategory) => {
        if (searchResult?.associatedCategoryIds?.includes(subCategory.publishCategoryId)) {
          categoryHeaderViewModelList?.push(subCategory);
        }
        getAssociatedChildCategoryList(searchResult, subCategory, categoryHeaderViewModelList);
      });
    });
  searchResult.associatedCategoryList = categoryHeaderViewModelList?.reduce((accumulator, currentValue) => {
    const existingItem = accumulator.find((item) => item.categoryCode === currentValue.categoryCode);

    if (!existingItem) {
      accumulator.push(currentValue);
    }

    return accumulator;
  }, [] as ICategory[]);
}

// Get associated child category list.
export function getAssociatedChildCategoryList(searchResult: ISearchResponse, subCategory: ICategory, categoryHeaderViewModelList: ICategory[]) {
  if (subCategory?.childCategoryItems && subCategory?.childCategoryItems?.length > 0) {
    subCategory?.childCategoryItems?.forEach((childCategory: ICategory) => {
      if (searchResult?.associatedCategoryIds?.includes(childCategory.publishCategoryId)) {
        categoryHeaderViewModelList?.push(childCategory);
      }
      getAssociatedChildCategoryList(searchResult, childCategory, categoryHeaderViewModelList);
    });
  }
  if (subCategory?.subCategories && subCategory?.subCategories?.length > 0) {
    subCategory?.subCategories?.forEach((childCategory: ICategory) => {
      if (searchResult?.associatedCategoryIds?.includes(childCategory.publishCategoryId)) {
        categoryHeaderViewModelList?.push(childCategory);
      }
      getAssociatedChildCategoryList(searchResult, childCategory, categoryHeaderViewModelList);
    });
  }
}

export async function getSearchedProducts(
  expand: ExpandCollection,
  filters: IFilterTuple[],
  productListModel: IProductListRequest,
  searchParams: ISearchParams,
  portalData: IPortalDetail
) {
  const sortValue = await getSortByProductList(Number(searchParams?.sort));
  const catalogCode = await getCatalogCode(portalData);
  const refineBy = JSON.stringify(productListModel.RefineBy);

  const categoryProducts: ISearchResponse = convertCamelCase(
    (await Searches_fullTextSearchBySearchKeyword(
      searchParams?.searchTerm || "",
      portalData?.localeCode || APP.DEFAULT_LOCALE,
      catalogCode || "",
      portalData?.storeCode,
      true,
      false,
      false,
      expand,
      filters as FilterTuple[],
      sortValue,
      productListModel?.PageNumber,
      productListModel?.PageSize,
      refineBy
    )) || {}
  );

  if (categoryProducts && categoryProducts.products) {
    for (const product of categoryProducts.products) {
      const promotions: IPromotion[] = product.promotions ? mapPromotionValues(product.promotions) : [];
      product.promotions = promotions;
      product.isObsolete = stringToBooleanV2(getAttributeValue(product.attributes as IAttributeDetails[], PRODUCT.IS_OBSOLETE, "attributeValues"));
    }
  }

  return categoryProducts;
}

/**
 * Get categories list for webstore.
 * @returns list of webstore categories.
 */
export async function getCategories(portalId: number, localeId: number, publishCatalogId: number) {
  try {
    const filters: IFilterTuple[] = await getCategoryFilters(portalId, localeId, publishCatalogId);
    return getCategoryList(filters);
  } catch (error) {
    logServer.error(AREA.CATEGORY, errorStack(error));
    return null;
  }
}

export async function saveSearchReportData(searchTerm: string | undefined, portalData: IPortalDetail, categoryResult: ISearchResponse, userData: IUser) {
  const searchReportModel: ISearchReportModel = {
    StoreCode: portalData?.storeCode || "",
    UserId: userData.userId || 2,
    UserProfileId: (userData.profiles && userData.profiles.at(0)?.profileId) || undefined,
    SearchProfileId: categoryResult?.searchProfileId || 1,
    ResultCount: Number(categoryResult?.paginationDetail?.totalResults || 0),
    SearchKeyword: searchTerm,
    TransformationKeyword: categoryResult?.suggestTerm,
  };
  const saveSearchReportData = await SearchReports_searchReport(searchReportModel);
  return saveSearchReportData;
}

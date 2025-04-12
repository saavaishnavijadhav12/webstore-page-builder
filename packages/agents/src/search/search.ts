import { AREA, errorStack, logServer } from "@znode/logger/server";
import { CMSSearchConfigurations_cmsSearchConfigurations, FilterTuple, Searches_suggestionByKeyword } from "@znode/clients/v2";
import { FilterCollection, FilterKeys, FilterOperators, convertCamelCase, convertPascalCase, createFilterTuple, generateTagName } from "@znode/utils/server";
import {
  HydratedSearchBrandResponse,
  HydratedSearchCategoryResponse,
  HydratedSearchContentResponse,
  SearchKeywords_searchKeywords,
  SearchSettings_hydratedSearchGetBySearchTerm,
  SearchSettings_hydratedSearchGetByStoreCode,
} from "@znode/clients/v2";
import { ICMSPages, ISearchCMSPages } from "@znode/types/keyword-search";
import {
  IHydratedSearchModel,
  ISearchBrand,
  ISearchCategory,
  ISearchContent,
  ISearchKeywordsRedirectListModel,
  ISearchKeywordsRedirectModel,
  ISearchParams,
} from "@znode/types/search-params";
import { getCategoryFilters } from "../category";

import { IFilterTuple } from "@znode/types/filter";
import { SEARCH } from "@znode/constants/search";
import { CACHE_KEYS } from "@znode/constants/cache-keys";

export async function getSuggestions(keyword: string, portalId: number, localeId: number, localeCode: string, storeCode: string, catalogCode: string, publishCatalogId?: number) {
  try {
    const filters: IFilterTuple[] = getCategoryFilters(portalId, localeId, publishCatalogId || 0);
    const searchData = await Searches_suggestionByKeyword(keyword, true, storeCode, localeCode, catalogCode, filters as FilterTuple[], undefined, undefined, undefined, undefined);
    const searchDetails = convertCamelCase(searchData?.Search);
    if (searchDetails?.products) {
    return searchDetails?.products;
    }
    return null;
  } catch (error) {
    logServer.error(AREA.SEARCH, error as string);
    return null;
  }
}

export async function checkURLExistForSearchTerm(searchTerm: string, publishCatalogId: number) {
  try {
    if (searchTerm && publishCatalogId) {
      const filters: IFilterTuple[] = [];

      filters.push(createFilterTuple(FilterKeys.PublishCatalogId, FilterOperators.Equals, publishCatalogId?.toString()));
      filters.push(createFilterTuple(FilterKeys.Keywords, FilterOperators.Contains, searchTerm));

      const searchRedirectList = await SearchKeywords_searchKeywords(convertPascalCase(filters), undefined, undefined, undefined);
      const searchList = convertCamelCase(searchRedirectList);
      const updatedKeywordsList: ISearchKeywordsRedirectModel[] = getUpdatedKeywordList(searchList);
      if (updatedKeywordsList.length > 0) {
        searchList.keywordsList.push(...updatedKeywordsList);
      }
      const keywordsList = searchList.keywordsList;
      const foundKeyword = keywordsList.find((x: ISearchKeywordsRedirectModel) => x.keywords.toLowerCase() === searchTerm?.toLowerCase().trim());
      return foundKeyword?.url ?? "";
    }
    return "";
  } catch (error) {
    logServer.error(AREA.SEARCH, errorStack(error));
    return "";
  }
}

function getUpdatedKeywordList(list: ISearchKeywordsRedirectListModel): ISearchKeywordsRedirectModel[] {
  const updatedKeywordList = list.keywordsList
    .flatMap((item: { keywords: string; url: string }) => item.keywords.split(",").map((keyword: string) => ({ keywords: keyword.trim(), url: item.url })))
    .filter((item: { keywords: string }) => item.keywords !== "");
  return updatedKeywordList;
}

export async function fullTextContentPageSearch(searchParams: ISearchParams, filters: IFilterTuple[], storeCode?: string, localeCode?: string) {
  try {
    const cacheInvalidator = new FilterCollection();
    cacheInvalidator.add(
      FilterKeys.CacheTags,
      FilterOperators.Contains,
      generateTagName(`${CACHE_KEYS.PORTAL}, ${CACHE_KEYS.DYNAMIC_TAG}`, storeCode || "", "CmsSearchConfigurations")
    );
    const fullTextContentPageData = convertCamelCase(
      (await CMSSearchConfigurations_cmsSearchConfigurations(
        storeCode || "",
        localeCode || "",
        searchParams?.searchTerm || "",
        undefined,
        cacheInvalidator.filterTupleArray as FilterTuple[]
      )) || {}
    );
    const mapCMSPages = (cmsPages: ICMSPages[]) => {
      return (
        cmsPages?.map((cmsPage: ICMSPages) => ({
          seoTitle: cmsPage.seoTitle,
          seoDescription: cmsPage.seoDescription,
          seoUrl: cmsPage.seoUrl,
          pageTitle: cmsPage.pageTitle,
          contentPageId: cmsPage.contentPageId,
        })) || []
      );
    };

    if (fullTextContentPageData?.cmsPages) {
      const cmsPageData = {
        cmsPages: mapCMSPages(fullTextContentPageData.cmsPages),
        totalCMSPageCount: fullTextContentPageData.totalCMSPageCount,
      };
      return cmsPageData;
    }
    return { cmsPages: [], totalCMSPageCount: 0 };
  } catch (error) {
    logServer.error(AREA.SEARCH, errorStack(error));
    return {} as ISearchCMSPages;
  }
}

export async function getHydratedSearchContent(keyword: string, catalogCode: string, userProfileId: number, storeCode: string, localeCode: string) {
  try {
    if (storeCode && localeCode && catalogCode && userProfileId) {
      const profileId = userProfileId;

      const hydratedSearchContent =
        !!keyword && keyword.length > 0
          ? await SearchSettings_hydratedSearchGetBySearchTerm(keyword.trim(), storeCode, localeCode, catalogCode, profileId)
          : await SearchSettings_hydratedSearchGetByStoreCode(storeCode, localeCode, catalogCode, profileId);

      const categoryData: ISearchCategory[] = createCategoryData(hydratedSearchContent?.HydratedSearchCategoryList || []);
      const brandData: ISearchBrand[] = createBrandData(hydratedSearchContent?.HydratedSearchBrandList || []);
      const contentData: ISearchContent[] = createContentData(hydratedSearchContent?.HydratedSearchContentList || []);

      return {
        hydratedSearchProductList: convertCamelCase(hydratedSearchContent?.HydratedSearchProductList),
        hydratedSearchCategoryList: categoryData,
        hydratedSearchBrandList: brandData,
        hydratedSearchContentList: contentData,
        hydratedSearchActivityList: convertCamelCase(hydratedSearchContent?.HydratedSearchActivityList),
        totalProductCount: hydratedSearchContent.TotalProductCount,
        isMySearchesEnabled: hydratedSearchContent.IsMySearchesEnabled,
        mySearchesResultCount: hydratedSearchContent.MySearchesResultCount,
      } as IHydratedSearchModel;
    }
    return {} as IHydratedSearchModel;
  } catch (error) {
    logServer.error(AREA.SEARCH, errorStack(error));
    return {} as IHydratedSearchModel;
  }
}

function createCategoryData(hydratedSearchList: HydratedSearchCategoryResponse[]): ISearchCategory[] {
  return hydratedSearchList?.map((searchContent: HydratedSearchCategoryResponse) => {
    let link = "";
    let type = "";

    if (searchContent.CategoryId) {
      link = searchContent.SEOUrl ? `/${searchContent.SEOUrl}` : `/category/${searchContent.CategoryId}`;
      type = SEARCH.CATEGORY;
    }

    return {
      categoryId: searchContent.CategoryId,
      categoryName: searchContent.CategoryName,
      imagePath: searchContent.ImagePath,
      seoUrl: searchContent.SEOUrl,
      link,
      type,
    } as ISearchCategory;
  });
}

function createBrandData(hydratedSearchList: HydratedSearchBrandResponse[]): ISearchBrand[] {
  return hydratedSearchList?.map((searchContent: HydratedSearchBrandResponse) => {
    let link = "";
    let type = "";

    if (searchContent.BrandId) {
      link = `/brand/${searchContent.BrandCode}`;
      type = SEARCH.BRAND;
    }

    return {
      brandId: searchContent.BrandId,
      brandCode: searchContent.BrandCode,
      brandName: searchContent.BrandName,
      imagePath: searchContent.ImagePath,
      seoUrl: searchContent.SEOUrl,
      link,
      type,
    } as ISearchBrand;
  });
}

function createContentData(hydratedSearchList: HydratedSearchContentResponse[]): ISearchContent[] {
  return hydratedSearchList?.map((searchContent: HydratedSearchContentResponse) => {
    let link = "";
    if (SEARCH.CONTENT_PAGE_NAME in searchContent) {
      link = `/search/search-term/${searchContent.ContentPageName}?activeTab=pagesTab`;
    }
    return {
      contentPageId: searchContent.ContentPageId,
      contentPageName: searchContent.ContentPageName,
      seoUrl: searchContent.SEOUrl,
      link,
    } as ISearchContent;
  });
}

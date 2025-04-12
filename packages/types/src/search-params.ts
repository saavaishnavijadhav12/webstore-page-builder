import { IBase } from "./base";

export interface ISearchParams extends IBase {
  facetGroup?: string | null;
  fromSearch?: boolean | null;
  sort?: string | null;
  pageNumber?: string | null;
  pageSize?: string | null;
  pageIndex?: string | null;
  searchTerm?: string | undefined;
  filterList?: { [key: string]: string } | null;
  isPendingPayment?: string;
  quoteId?: string;
  brand?: { [key: string]: string };
  quoteNumber?: string;
  receiptModule?: string;
  receiptNumber?: string;
  orderNumber?: string;
  rmaReasonReturnId?: number;
  properties?: { [key: string]: string };
  returnUrl?: string;
}

//to map with API parameter
export interface ISearchRequest {
  keyword?: string;
  pageSize?: number;
  pageNumber?: number;
  localeId: number;
  catalogId?: number;
  portalId?: number;
  isAutocomplete?: boolean;
  profileId?: number;
  useSuggestion?: boolean;
  category?: string;
  categoryId?: number;
  searchTerm?: string;
  brandName?: string;
  isFacetList?: boolean;
  sort?: number;
}

export interface ISearchKeywordsRedirectListModel {
  keywordsList: { keywords: string; url: string }[];
}

export interface ISearchKeywordsRedirectModel {
  keywords: string;
  url: string;
}

export interface IHydratedSearchProductModel {
  productId: number;
  productName: string;
  imagePath: string;
  seoUrl: string;
}

export interface ISearchCategory {
  categoryId: number;
  categoryName: string;
  imagePath: string;
  seoUrl: string;
  link?: string;
  type?: string;
}

export interface ISearchBrand {
  brandId: number;
  brandCode: string;
  brandName: string;
  imagePath: string;
  seoUrl: string;
  link?: string;
  type?: string;
}

export interface IHydratedSearchActivityModel {
  searchKeyword: string;
}

export interface ISearchContent {
  contentPageId: number;
  contentPageName: string;
  seoUrl: string;
  link?: string;
  type?: string;
}

export interface IHydratedSearchModel {
  hydratedSearchProductList: IHydratedSearchProductModel[];
  hydratedSearchCategoryList: ISearchCategory[];
  hydratedSearchBrandList: ISearchBrand[];
  hydratedSearchActivityList: IHydratedSearchActivityModel[];
  hydratedSearchContentList: ISearchContent[];
  isMySearchesEnabled: boolean;
  mySearchesResultCount: number;
  totalProductCount: number;
}

export interface IHydratedSearch {
  hydratedSearch: IHydratedSearchModel;
}

export interface ISearchProduct {
  categorySeoUrl?: string;
  name: string;
  seoUrl?: string;
  categoryId?: string;
  categoryName?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  imageSmallThumbnailPath?: string;
  imageThumbNailPath?: string;
  imageSmallPath?: string;
  imageMediumPath?: string;
  catalogId: number;
  localeId: number;
  version: number;
  znodeProductId: number;
  id: number;
  sku: string;
  categoryIds?: string[];
}

export interface NestedSearchParams extends ISearchParams {
  searchParams: {
    orderNumber?: string;
    isPendingPayment?: string;
    receiptModule?: string;
  };
}

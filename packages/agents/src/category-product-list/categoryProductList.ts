import { AREA, errorStack, logServer } from "@znode/logger/server";

import { ISearchParams } from "@znode/types/search-params";
import { getBreadCrumbs } from "../breadcrumb";
import { getProductList } from "../product";

async function getBreadsCrumbs(znodeCategoryId: number, isParentCategory: boolean): Promise<{ breadCrumb: string; breadCrumbPDP: string }> {
  try {
    const breadCrumbsResponse = await getBreadCrumbs(znodeCategoryId, isParentCategory);
    return breadCrumbsResponse ;
  } catch (error) {
    logServer.error(AREA.PRODUCT, errorStack(error));
    return { breadCrumb: "", breadCrumbPDP: "" };
  }
}

export async function categoryProductList(categoryId: number, searchParams: ISearchParams = {}) {
  try {
    const { productList, facetList, isEnableCompare } = await getProductList(categoryId, searchParams);
    const breadCrumbsTitle = await getBreadsCrumbs(Number(productList?.categoryId || 0), true);
    return {
      productsData: productList,
      facetData: facetList,
      breadCrumbsTitle: breadCrumbsTitle,
      isEnableCompare,
    };
  } catch (error) {
    logServer.error(AREA.PRODUCT, errorStack(error));
    return null;
  }
}

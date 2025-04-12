import { CompareProductList } from "../product";
import { FacetList } from "../product/facet";
import { ICategory } from "@znode/types/category";
import { ISearchTerm } from "@znode/types/search-term";
import { ProductList } from "../product/product-list";

interface ISearchCategoryFetcher {
  searchResult: ISearchTerm;
  showWishlist?: boolean;
}

export function SearchCategoryFetcher({ searchResult, ...rest }: ISearchCategoryFetcher) {
  const { filteredProductData, associatedCategoryList, filteredAttribute, isEnableCompare } = searchResult || {};

  return (
    <>
      <div className="grid grid-cols-1 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {((filteredAttribute && filteredAttribute.length > 0) || (associatedCategoryList && associatedCategoryList.length > 0)) && filteredProductData?.totalProducts > 0 && (
          <div className="col-span-4 lg:col-span-1">
            <FacetList facetData={filteredAttribute} associatedCategoryList={associatedCategoryList as ICategory[]} />
            {isEnableCompare && <CompareProductList />}
          </div>
        )}
        <div className="col-span-4">
          <ProductList productData={filteredProductData} isFromSearch={true} isEnableCompare={isEnableCompare} {...rest} />
        </div>
      </div>
    </>
  );
}

import { IFacets } from "@znode/types/facet";
import { Facet } from "./Facet";
import { ICategory } from "@znode/types/category";
import { SearchResultCategoryList } from "./SearchResultCategoryList";

export function FacetList({ facetData, associatedCategoryList, ...rest }: Readonly<{ facetData: IFacets[]; associatedCategoryList?: ICategory[]; pageSize?: number | null }>) {
  return (
    <>
      {associatedCategoryList && associatedCategoryList.length > 0 && <SearchResultCategoryList facetData={associatedCategoryList ? associatedCategoryList : []} />}
      {facetData?.length > 0 && <Facet facetData={facetData} {...rest} />}
    </>
  );
}

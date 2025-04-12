import { ISearchParams } from "@znode/types/search-params";
import { ISearchTerm } from "@znode/types/search-term";
import { NextIntlClientProvider } from "next-intl";
import { SearchCategoryFetchWrapper } from "@znode/base-components/components/search-term";
import { fetchMessages } from "@znode/utils/server";
import { getSearchResult } from "@znode/agents/search";
import { WishlistMarker } from "@znode/base-components/common/wishlist-marker";

/**
 *
 * @param props This will be used to render product details page. render page details.
 * @returns will return jsx component
 */

export default async function searchBySeo({ params, searchParams }: { searchParams: ISearchParams; params: { searchTerm: string } }) {
  const decodedSearchedText = decodeURIComponent(params?.searchTerm);
  searchParams.searchTerm = decodedSearchedText;
  const searchResult = await getSearchResult(searchParams);
  const localeMessages = ["Product", "Common", "Facet", "Pagination", "FacetChipList", "Price", "Addon", "WishList", "CMSSearch"];
  const messages = await fetchMessages(localeMessages);
  return (
    <NextIntlClientProvider messages={{ ...messages }}>
      {searchResult && (
        <>
          <SearchCategoryFetchWrapper searchResult={searchResult as ISearchTerm} searchTerm={decodedSearchedText} />
          <WishlistMarker />
        </>
      )}
    </NextIntlClientProvider>
  );
}

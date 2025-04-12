import { IHydratedSearchModel } from "@znode/types/search-params";
import { httpRequest } from "../base";
import { objectToQueryString } from "@znode/utils/component";

export const getSearchRedirectURL = async (props: { [key: string]: string | number }) => {
  const queryString: string = objectToQueryString(props);
  const searchRedirectKeywordList = await httpRequest<string>({ endpoint: `/api/search/search-redirect?${queryString}` });
  return searchRedirectKeywordList;
};

export const getHydratedSuggestionSearch = async (props: { [key: string]: string | number }) => {
  const queryString: string = objectToQueryString(props);
  const hydratedSearchData = await httpRequest<IHydratedSearchModel>({ endpoint: `/api/search/search-hydrated?${queryString}` });
  return hydratedSearchData;
};

export const getSuggestions = async (props:{ [key: string]: string | number }) => {
  const queryString: string = objectToQueryString(props);
  const suggestionList = await httpRequest<IHydratedSearchModel>({ endpoint:`/api/search/search-suggestions?${queryString}` });
  return suggestionList;
};
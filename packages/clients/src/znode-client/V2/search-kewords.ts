//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

import * as Models from "./multifront-types";
import * as MultifrontTypes from "./multifront-types";

import { buildEndpointQueryString, getHeaders } from "./base";

import { FilterTuple } from "./multifront-types";

const baseUrl = process.env.API_URL;

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
 * Gets keywords redirect list.
 * @param filter (optional) A collection of filters to apply when retrieving the address list.
 * @param sort (optional) Sorting determines whether the records are to be sorted in ascending or descending order (if no preferences are specified, the system generated account id is used for sorting).
 * @param pageIndex (optional) When the record count is high, utilizing pagination enables the retrieval of a specific range of records.
 * @param pageSize (optional) The number of items to be displayed per page in paginated within paginated results.
 * @return Success(Indicates that the request is successfully executed and the response body return the data in CategoryListResponse model.)
 */

export async function SearchKeywords_searchKeywords(
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.SearchKeywordsRedirectsListResponse> {
  let options_: RequestInit = {
    method: "GET",

    headers: await getHeaders("GET", String(baseUrl)),
  };
  let url_ = baseUrl + "v2/search-keywords";

  url_ += buildEndpointQueryString({ filter, sort, pageIndex, pageSize });

  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return SearchKewords_processSearchKeywords(_response);
  });
}

function SearchKewords_processSearchKeywords(response: Response): Promise<MultifrontTypes.SearchKeywordsRedirectsListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.SearchKeywordsRedirectsListResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException(
        "No Content(Indicates that the request is successfully executed, but the response body does not contain any data.)",
        status,
        _responseText,
        _headers,
        result204
      );
    });
  } else if (status === 400) {
    return response.text().then((_responseText) => {
      let result400: any = null;
      result400 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Bad Request(The request contain invalid Data.)", status, _responseText, _headers, result400);
    });
  } else if (status === 500) {
    return response.text().then((_responseText) => {
      let result500: any = null;
      result500 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Server Error(Indicates that an error occurred on the server.)", status, _responseText, _headers, result500);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any }, result?: any): any {
  try {
    if (result !== null && result !== undefined) throw result;
    else throw new Error(message);
  } catch (ex) {
    const parsedRes = response === "" ? null : (JSON.parse(response) as any);
    return parsedRes;
  }
}

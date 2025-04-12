//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

import * as Models from "../../types/multifront-types";
import { addCacheOption, buildEndpointQueryString, getHeaders } from "./base";
import { FilterTuple } from "../../types/multifront-types";
import * as MultifrontTypes from "../../types/multifront-types";

const baseUrl = process.env.API_URL;

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
         * Gets list of published categories.
         * @param includeAssociatedCategories This parameter is used to include the child categories.
        if includeAssociatedCategories  is true then all the categories of parent product
        is included otherwise only parent categories will display.
        Default value for includeAssociatedCategories is true.
         * @param expand (optional) 
         * @param filter (optional) 
         * @param sort (optional) 
         * @param pageIndex (optional) 
         * @param pageSize (optional) 
         * @return OK
         */

export async function SiteMap_getSiteMapCategoryList(
  includeAssociatedCategories: boolean,
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.StringResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "SiteMap/GetSiteMapCategoryList/{includeAssociatedCategories}";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (includeAssociatedCategories === undefined || includeAssociatedCategories === null) throw new Error("The parameter 'includeAssociatedCategories' must be defined.");
  url_ = url_.replace("{includeAssociatedCategories}", encodeURIComponent("" + includeAssociatedCategories));
  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return SiteMap_processGetSiteMapCategoryList(_response);
  });
}

function SiteMap_processGetSiteMapCategoryList(response: Response): Promise<MultifrontTypes.StringResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.StringResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      return throwException("No Content", status, _responseText, _headers);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Gets list of brands.
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function SiteMap_getSiteMapBrandList(
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.BrandListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "SiteMap/GetSiteMapBrandList";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return SiteMap_processGetSiteMapBrandList(_response);
  });
}

function SiteMap_processGetSiteMapBrandList(response: Response): Promise<MultifrontTypes.BrandListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.BrandListResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      return throwException("No Content", status, _responseText, _headers);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Gets list of Products.
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function SiteMap_getSiteMapProductList(
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.PublishProductListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "SiteMap/GetSiteMapProductList";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return SiteMap_processGetSiteMapProductList(_response);
  });
}

function SiteMap_processGetSiteMapProductList(response: Response): Promise<MultifrontTypes.PublishProductListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.PublishProductListResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      return throwException("No Content", status, _responseText, _headers);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * This Endpoint is used to render the sitemap xml documents.
 * @param fileName SiteMap Xml fileName.
 * @param portalId Portal Id
 * @return OK
 */

export async function SiteMap_siteMapXML(fileName: string, portalId: number): Promise<any> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "SiteMap/SiteMapXML/{fileName}/{portalId}";

  if (fileName === undefined || fileName === null) throw new Error("The parameter 'fileName' must be defined.");
  url_ = url_.replace("{fileName}", encodeURIComponent("" + fileName));
  if (portalId === undefined || portalId === null) throw new Error("The parameter 'portalId' must be defined.");
  url_ = url_.replace("{portalId}", encodeURIComponent("" + portalId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return SiteMap_processSiteMapXML(_response);
  });
}

function SiteMap_processSiteMapXML(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as any);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status === 500) {
    return response.text().then((_responseText) => {
      let result500: any = null;
      result500 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Internal Server Error", status, _responseText, _headers, result500);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * This Endpoint is used to render the sitemap xml documents.
 * @param fileName SiteMap Xml fileName.
 * @param portalId Portal Id
 * @return Success
 */

export async function SiteMap_siteMapXMLByFileName(fileName: string, portalId: number): Promise<any> {
  let options_: RequestInit = {
    method: "GET",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "SiteMap/SiteMapXML/{fileName}/{portalId}";
  if (fileName === undefined || fileName === null) throw new Error("The parameter 'fileName' must be defined.");
  url_ = url_.replace("{fileName}", encodeURIComponent("" + fileName));
  if (portalId === undefined || portalId === null) throw new Error("The parameter 'portalId' must be defined.");
  url_ = url_.replace("{portalId}", encodeURIComponent("" + portalId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return SiteMap_processSiteMapXMLByFileName(_response);
  });
}

function SiteMap_processSiteMapXMLByFileName(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as string);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status === 500) {
    return response.text().then((_responseText) => {
      let result500: any = null;
      result500 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Server Error", status, _responseText, _headers, result500);
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

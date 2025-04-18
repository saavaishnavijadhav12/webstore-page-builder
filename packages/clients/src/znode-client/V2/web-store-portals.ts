//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
import * as Models from "./multifront-types";
import { addCacheOption, buildEndpointQueryString, getHeaders } from "./base";
import { FilterTuple } from "./multifront-types";
import * as MultifrontTypes from "./multifront-types";

const baseUrl = process.env.API_URL;

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
 * Gets the robots.txt data based on the storecode.
 * @param storeCode storeCode is unique identifier for retrieving the data regarding the robotstxt based on the portal id.
 * @param expand (optional) The expand collection is use to get the data for the ZnodePortal which will gives the store name.
 * @return Success(Indicates that the request is successfully executed and the response body contains the requested data.)
 */

export async function Portals_robotsTxtByStoreCode(
  storeCode: string,
  expand: string[] | undefined,
  cacheInvalidator?: FilterTuple[] | undefined
): Promise<MultifrontTypes.RobotsTextResponse> {
  let options_: RequestInit = {
    method: "GET",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };
  options_ = addCacheOption(cacheInvalidator ?? [], options_);

  let url_ = baseUrl + "v2/portals/{storeCode}/robots-txt";

  url_ += buildEndpointQueryString({ expand });

  if (storeCode === undefined || storeCode === null)
    throw new Error("The parameter 'storeCode' must be defined.");
  url_ = url_.replace("{storeCode}", encodeURIComponent("" + storeCode));
  if (expand === null)
    throw new Error("The parameter 'expand' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Portals_processRobotsTxtByStoreCode(_response);
  });
}

function Portals_processRobotsTxtByStoreCode(
  response: Response
): Promise<MultifrontTypes.RobotsTextResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then(_responseText => {
      let result200: any = null;
      result200 =
        _responseText === ""
          ? null
          : (JSON.parse(_responseText) as Models.RobotsTextResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then(_responseText => {
      let result204: any = null;
      result204 =
        _responseText === ""
          ? null
          : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException(
        "No Content(Indicates that the request is successfully executed, but the response body does not contain any data.)",
        status,
        _responseText,
        _headers,
        result204
      );
    });
  } else if (status === 400) {
    return response.text().then(_responseText => {
      let result400: any = null;
      result400 =
        _responseText === ""
          ? null
          : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException(
        "Bad Request(The request contain invalid Data.)",
        status,
        _responseText,
        _headers,
        result400
      );
    });
  } else if (status === 500) {
    return response.text().then(_responseText => {
      let result500: any = null;
      result500 =
        _responseText === ""
          ? null
          : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException(
        "Server Error(Indicates that an error occurred on the server.)",
        status,
        _responseText,
        _headers,
        result500
      );
    });
  } else if (status === 404) {
    return response.text().then(_responseText => {
      let result404: any = null;
      result404 =
        _responseText === ""
          ? null
          : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException(
        "This status code (Indicates that the server cannot find the requested resource.)",
        status,
        _responseText,
        _headers,
        result404
      );
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then(_responseText => {
      return throwException(
        "An unexpected server error occurred.",
        status,
        _responseText,
        _headers
      );
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Gets the portal approvaldata based on the storecode.
 * @param storeCode storeCode is unique identifier for retrieving the data regarding the portalapporvaldetails based on the store code.
 * @return Success(Indicates that the request is successfully executed and the response body contains the requested data.)
 */

export async function Portals_approvalDetailsByStoreCode(storeCode: string, cacheInvalidator?: FilterTuple[] | undefined): Promise<MultifrontTypes.PortalsApprovalResponse> {
  let options_: RequestInit = {
    method: "GET",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };
  options_ = addCacheOption(cacheInvalidator ?? [], options_);

  let url_ = baseUrl + "v2/portals/{storeCode}/approval-details";

  if (storeCode === undefined || storeCode === null) throw new Error("The parameter 'storeCode' must be defined.");
  url_ = url_.replace("{storeCode}", encodeURIComponent("" + storeCode));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Portals_processApprovalDetailsByStoreCode(_response);
  });
}

function Portals_processApprovalDetailsByStoreCode(response: Response): Promise<MultifrontTypes.PortalsApprovalResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.PortalsApprovalResponse);
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
  } else if (status === 404) {
    return response.text().then((_responseText) => {
      let result404: any = null;
      result404 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("This status code indicates that the server cannot find the requested resource.", status, _responseText, _headers, result404);
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

/**
 * Retrieves an portal detail.
 * @param storeCode The unique identifier of the portal.
 * @return Success(Indicates that the request is successfully executed and the response body return the data in WebStorePortalResponse model.)
 */

export async function WebStorePortals_portalsByStoreCode(storeCode: string, cacheInvalidator?: FilterTuple[] | undefined): Promise<MultifrontTypes.WebStorePortalResponse> {
  let options_: RequestInit = {
    method: "GET",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };
  options_ = addCacheOption(cacheInvalidator ?? [], options_);

  let url_ = baseUrl + "v2/portals/{storeCode}";

  if (storeCode === undefined || storeCode === null) throw new Error("The parameter 'storeCode' must be defined.");
  url_ = url_.replace("{storeCode}", encodeURIComponent("" + storeCode));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return WebStorePortals_processPortalsByStoreCode(_response);
  });
}

function WebStorePortals_processPortalsByStoreCode(response: Response): Promise<MultifrontTypes.WebStorePortalResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.WebStorePortalResponse);
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

/**
 * Retrieves an portal detail.
 * @param storeCode The unique identifier of the portal.
 * @param type The type of application requesting the portal data.
 * @param localeCode (optional) The unique identifier of the locale.
 * @return Success(Indicates that the request is successfully executed and the response body return the data in WebStorePortalResponse model.)
 */

export async function WebStorePortals_applicationByStoreCode(
  storeCode: string,
  type: Models.ApplicationTypesEnum,
  localeCode: string | undefined,
  cacheInvalidator?: FilterTuple[] | undefined
): Promise<MultifrontTypes.WebStorePortalResponse> {
  let options_: RequestInit = {
    method: "GET",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };
  options_ = addCacheOption(cacheInvalidator ?? [], options_);

  let url_ = baseUrl + "v2/portals/{storeCode}/application/{type}";

  url_ += (url_.indexOf("?") === -1 ? "?" : "&") + "localeCode=" + encodeURIComponent("" + localeCode);

  if (storeCode === undefined || storeCode === null) throw new Error("The parameter 'storeCode' must be defined.");
  url_ = url_.replace("{storeCode}", encodeURIComponent("" + storeCode));
  if (type === undefined || type === null) throw new Error("The parameter 'type' must be defined.");
  url_ = url_.replace("{type}", encodeURIComponent("" + type));
  if (localeCode === null) throw new Error("The parameter 'localeCode' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return WebStorePortals_processApplicationByStoreCode(_response);
  });
}

function WebStorePortals_processApplicationByStoreCode(response: Response): Promise<MultifrontTypes.WebStorePortalResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.WebStorePortalResponse);
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
  } else if (status === 404) {
    return response.text().then((_responseText) => {
      let result404: any = null;
      result404 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Not Found", status, _responseText, _headers, result404);
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

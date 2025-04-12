//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
import * as MultifrontTypes from "../../types/interface";

import { getHeaders } from "./BaseClient";
import * as Models from "../../types/interface";

import { buildEndpointQueryString } from "../V1/base";

const baseUrl = process.env.API_URL;
/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
 * Reorders items based on the provided order model.
 * @param body (optional)
 * @return OK
 */

export async function Orders_reorder(classType: string, body: MultifrontTypes.ReorderRequestModel | undefined): Promise<MultifrontTypes.ReorderResponseModel> {
  let url_ = baseUrl + "commerceapi/v1/{classType}/reorder";

  if (classType === undefined || classType === null) throw new Error("The parameter 'classType' must be defined.");
  url_ = url_.replace("{classType}", encodeURIComponent("" + classType));
  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Orders_processReorder(_response);
  });
}

function Orders_processReorder(response: Response): Promise<MultifrontTypes.ReorderResponseModel> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as MultifrontTypes.ReorderResponseModel);
      return result200;
    });
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as MultifrontTypes.ReorderResponseModel);
      return result201;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as MultifrontTypes.ZnodeErrorDetail);
      return throwException(
        "Success with No Content(Indicates that the request is successfully executed, but the response body does not contain any data.)",
        status,
        _responseText,
        _headers,
        result204
      );
    });
  } else if (status === 400) {
    return response.text().then((_responseText) => {
      let result400: any = null;
      result400 = _responseText === "" ? null : (JSON.parse(_responseText) as MultifrontTypes.ZnodeErrorDetail);
      return throwException("Bad Request(Indicates that the server could not understand the request due to invalid syntax.)", status, _responseText, _headers, result400);
    });
  } else if (status === 500) {
    return response.text().then((_responseText) => {
      let result500: any = null;
      result500 = _responseText === "" ? null : (JSON.parse(_responseText) as MultifrontTypes.ZnodeErrorDetail);
      return throwException("Internal Server Error(Indicates that an error occurred on the server.)", status, _responseText, _headers, result500);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Retrieves a list of orders for a specific account user.
 * @param classType  ClassType as Orders to retrive order list.
 * @param filter (AccountId) Collection of filters to apply to the order list.
 * @param sort (optional) Collection of sort options to apply to the order list.
 * @param pageIndex (optional) The index of the page to retrieve.
 * @param pageSize (optional) The number of items per page.
 * @return Created(Indicates that the request is successfully executed and the response body return the data in OrderListModelResponse model.)
 */

export async function Accounts_ordersByAccountCode(
  classType: string | undefined,
  filter: MultifrontTypes.FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.OrderListModelResponse> {
  let options_: RequestInit = {
    method: "GET",

    headers: await getHeaders("GET", String(baseUrl)),
  };
  let url_ = baseUrl + "commerceapi/v1/{classType}/list";
  url_ += buildEndpointQueryString({ filter, sort, pageIndex, pageSize });
  if (classType === undefined || classType === null) throw new Error("The parameter 'classType' must be defined.");
  url_ = url_.replace("{classType}", encodeURIComponent("" + classType));
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");
  return fetch(url_, options_).then((_response: Response) => {
    return Accounts_processOrdersByAccountCode(_response);
  });
}

function Accounts_processOrdersByAccountCode(response: Response): Promise<MultifrontTypes.OrderListModelResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.OrderListModelResponse);
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
      return throwException("This status code indicates that the server cannot find the requested resource.)", status, _responseText, _headers, result404);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Order Tracking Details on classnumber and emailaddress.
 * @param classNumber The unique identifier of the class for which the details are retrieved.
 * @param emailAddress The email address used to retrieve the associated details.
 * @return OK (Indicates that the request was successfully executed, and the response body contains the requested data.)
 */

export async function Orders_orderTrackingDetailsByClassNumber(classNumber: string, emailAddress: string): Promise<MultifrontTypes.CommerceCollectionClassDetailResponseModel> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "commerceapi/v1/orders/order-tracking-details/{classNumber}/{emailAddress}";

  if (classNumber === undefined || classNumber === null) throw new Error("The parameter 'classNumber' must be defined.");
  url_ = url_.replace("{classNumber}", encodeURIComponent("" + classNumber));
  if (emailAddress === undefined || emailAddress === null) throw new Error("The parameter 'emailAddress' must be defined.");
  url_ = url_.replace("{emailAddress}", encodeURIComponent("" + emailAddress));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Orders_processOrderTrackingDetailsByClassNumber(_response);
  });
}

function Orders_processOrderTrackingDetailsByClassNumber(response: Response): Promise<MultifrontTypes.CommerceCollectionClassDetailResponseModel> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CommerceCollectionClassDetailResponseModel);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException(
        "No Content (Indicates that the request was successfully executed, but the response body does not contain any data.)",
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
      return throwException("Bad Request (Indicates that the server could not understand the request due to invalid syntax.)", status, _responseText, _headers, result400);
    });
  } else if (status === 404) {
    return response.text().then((_responseText) => {
      let result404: any = null;
      result404 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Not Found (Indicates that the server cannot find the requested resource.)", status, _responseText, _headers, result404);
    });
  } else if (status === 500) {
    return response.text().then((_responseText) => {
      let result500: any = null;
      result500 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("Internal Server Error (Indicates that an error occurred on the server.)", status, _responseText, _headers, result500);
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

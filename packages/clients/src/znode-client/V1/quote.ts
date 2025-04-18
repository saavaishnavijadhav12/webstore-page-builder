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
 * Create Quote
 * @param body (optional)
 * @return OK
 */

export async function Quote_create(body: Models.QuoteCreateModel | undefined): Promise<MultifrontTypes.CreateQuoteResponse> {
  let url_ = baseUrl + "Quote/Create";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processCreate(_response);
  });
}

function Quote_processCreate(response: Response): Promise<MultifrontTypes.CreateQuoteResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CreateQuoteResponse);
      return result200;
    });
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CreateQuoteResponse);
      return result201;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Get the list of all Quotes.
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function Quote_list(
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.QuoteListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "Quote/List";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processList(_response);
  });
}

function Quote_processList(response: Response): Promise<MultifrontTypes.QuoteListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.QuoteListResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Get Quote Receipt details.
 * @param quoteId quote Id to get Quote Details
 * @return OK
 */

export async function Quote_getQuoteReceipt(quoteId: number): Promise<MultifrontTypes.QuoteResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "Quote/GetQuoteReceipt/{quoteId}";

  if (quoteId === undefined || quoteId === null) throw new Error("The parameter 'quoteId' must be defined.");
  url_ = url_.replace("{quoteId}", encodeURIComponent("" + quoteId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processGetQuoteReceipt(_response);
  });
}

function Quote_processGetQuoteReceipt(response: Response): Promise<MultifrontTypes.QuoteResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.QuoteResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Get Quote details by Quote id.
 * @param omsQuoteId Quote Id
 * @return OK
 */

export async function Quote_getQuoteById(omsQuoteId: number): Promise<MultifrontTypes.QuoteDetailResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "Quote/GetQuoteById/{omsQuoteId}";

  if (omsQuoteId === undefined || omsQuoteId === null) throw new Error("The parameter 'omsQuoteId' must be defined.");
  url_ = url_.replace("{omsQuoteId}", encodeURIComponent("" + omsQuoteId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processGetQuoteById(_response);
  });
}

function Quote_processGetQuoteById(response: Response): Promise<MultifrontTypes.QuoteDetailResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.QuoteDetailResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Get Quote details by Quote Number.
 * @param quoteNumber Quote Number
 * @return OK
 */

export async function Quote_getQuoteByQuoteNumber(quoteNumber: string): Promise<MultifrontTypes.QuoteDetailResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "Quote/GetQuoteByQuoteNumber/{quoteNumber}";

  if (quoteNumber === undefined || quoteNumber === null) throw new Error("The parameter 'quoteNumber' must be defined.");
  url_ = url_.replace("{quoteNumber}", encodeURIComponent("" + quoteNumber));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processGetQuoteByQuoteNumber(_response);
  });
}

function Quote_processGetQuoteByQuoteNumber(response: Response): Promise<MultifrontTypes.QuoteDetailResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.QuoteDetailResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Convert quote to the order.
 * @param body (optional)
 * @return OK
 */

export async function Quote_convertQuoteToOrder(body: Models.ConvertQuoteToOrderModel | undefined): Promise<MultifrontTypes.OrderResponse> {
  let url_ = baseUrl + "Quote/ConvertQuoteToOrder";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processConvertQuoteToOrder(_response);
  });
}

function Quote_processConvertQuoteToOrder(response: Response): Promise<MultifrontTypes.OrderResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.OrderResponse);
      return result200;
    });
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.OrderResponse);
      return result201;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Get Quote LineItems by QuoteId.
 * @return OK
 */

export async function Quote_getQuoteLineItemByQuoteId(omsQuoteId: number): Promise<MultifrontTypes.QuoteLineItemResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "Quote/GetQuoteLineItemByQuoteId/{omsQuoteId}";

  if (omsQuoteId === undefined || omsQuoteId === null) throw new Error("The parameter 'omsQuoteId' must be defined.");
  url_ = url_.replace("{omsQuoteId}", encodeURIComponent("" + omsQuoteId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processGetQuoteLineItemByQuoteId(_response);
  });
}

function Quote_processGetQuoteLineItemByQuoteId(response: Response): Promise<MultifrontTypes.QuoteLineItemResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.QuoteLineItemResponse);
      return result200;
    });
  } else if (status === 204) {
    return response.text().then((_responseText) => {
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Update existing Quote.
 * @param body (optional)
 * @return OK
 */

export async function Quote_updateQuote(body: Models.UpdateQuoteModel | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Quote/UpdateQuote";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "PUT",
    headers: await getHeaders("PUT", String(baseUrl)),
    next: { revalidate: 0 },
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processUpdateQuote(_response);
  });
}

function Quote_processUpdateQuote(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.TrueFalseResponse);
      return result200;
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

/**
 * Get Quote Total by quote number
 * @param quoteNumber quote number
 * @return OK
 */

export async function Quote_getQuoteTotal(quoteNumber: string): Promise<MultifrontTypes.StringResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "Quote/GetQuoteTotal/{quoteNumber}";

  if (quoteNumber === undefined || quoteNumber === null) throw new Error("The parameter 'quoteNumber' must be defined.");
  url_ = url_.replace("{quoteNumber}", encodeURIComponent("" + quoteNumber));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Quote_processGetQuoteTotal(_response);
  });
}

function Quote_processGetQuoteTotal(response: Response): Promise<MultifrontTypes.StringResponse> {
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
      let result204: any = null;
      result204 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.ZnodeErrorDetail);
      return throwException("No Content", status, _responseText, _headers, result204);
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

export async function AccountQuote_isLastApprover(quoteId: number): Promise<any> {
  let options_: RequestInit = {
    method: "GET",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "AccountQuote/IsLastApprover/{quoteId}";
  if (quoteId === undefined || quoteId === null) throw new Error("The parameter 'quoteId' must be defined.");
  url_ = url_.replace("{quoteId}", encodeURIComponent("" + quoteId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return AccountQuote_processIsLastApprover(_response);
  });
}

function AccountQuote_processIsLastApprover(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.TrueFalseResponse);
      return result200;
    });
  } else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
      return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
  }
  return Promise.resolve<any>(null as any);
}

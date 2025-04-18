//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

import * as Models from "../../types/multifront-types";
import { addCacheOption, buildEndpointQueryString, getHeaders } from "./base";
import { FilterTuple } from "../../types/multifront-types";
import * as MultifrontTypes  from "../../types/multifront-types";

const baseUrl = process.env.API_URL;

/**
 * Get the suggestions.
 * @param body (optional)
 * @return OK
 */

export async function Typeahead_getTypeAheadResponse(body: Models.TypeaheadRequestModel | undefined): Promise<any> {
    let url_ = baseUrl + "Typeahead/GetTypeAheadResponse";
    url_ = url_.replace(/[?&]$/, "");
  
    const content_ = JSON.stringify(body);
  
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      cache: "no-store",
      headers: await getHeaders("POST", String(baseUrl)),
    };
  
    return fetch(url_, options_).then((_response: Response) => {
      return Typeahead_processGetTypeAheadResponse(_response);
    });
  }
  
  function Typeahead_processGetTypeAheadResponse(response: Response): Promise<any> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => (_headers[k] = v));
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.TypeaheadListResponse);
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
  
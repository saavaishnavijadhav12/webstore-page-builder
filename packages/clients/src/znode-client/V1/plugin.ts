//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
//import { CONFIG } from "constants/index";
const baseUrl = process.env.API_URL;
import { buildEndpointQueryString,getHeaders } from "./base";
import * as Models from "../../types/multifront-types";
import {FilterTuple} from "@znode/clients/v1";

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
         * @return OK
         */
            
export async function Plugin_getPluginConfigurations(pluginId:number, scopeName:string, portalId:number ): Promise<any> {
 

    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
      next: { revalidate: 0 },
    };

    let url_ = baseUrl + "Plugin/GetPluginConfigurations/{pluginId}/{scopeName}/{portalId}";

    if (pluginId === undefined || pluginId === null)
        throw new Error("The parameter 'pluginId' must be defined.");
    url_ = url_.replace("{pluginId}", encodeURIComponent("" + pluginId));
    if (scopeName === undefined || scopeName === null)
        throw new Error("The parameter 'scopeName' must be defined.");
    url_ = url_.replace("{scopeName}", encodeURIComponent("" + scopeName));
    if (portalId === undefined || portalId === null)
        throw new Error("The parameter 'portalId' must be defined.");
    url_ = url_.replace("{portalId}", encodeURIComponent("" + portalId));
    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processGetPluginConfigurations(_response);
 
    });
}


function Plugin_processGetPluginConfigurations(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginAttributeJsonResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @param body (optional) 
     * @return OK
     */

    export async function Plugin_installPlugin(body:Models.PluginDetailModel | undefined): Promise<any> {

    let url_ = baseUrl + "Plugin/InstallPlugin";

    url_ = url_.replace(/[?&]$/, "");

 const content_ = JSON.stringify(body);

     let options_: RequestInit = {
        body: content_,
        method: "POST",
        cache: "no-store",
        headers: await getHeaders("POST", String(baseUrl)),
    };

    return fetch(url_, options_).then((_response: Response) => {

        return Plugin_processInstallPlugin(_response);
    });
}

function Plugin_processInstallPlugin(response: Response): Promise<any> {
   const status = response.status;
   let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginInstallResponse;
    return result200;
    });
} else if (status === 201) {
    return response.text().then((_responseText) => {
    let result201: any = null;
    result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginInstallResponse;
    return result201;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @return OK
     */
        
export async function Plugin_getDetails(pluginId:number ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
      next: { revalidate: 0 },
    };

    let url_ = baseUrl + "Plugin/GetDetails/{pluginId}";

    if (pluginId === undefined || pluginId === null)
        throw new Error("The parameter 'pluginId' must be defined.");
    url_ = url_.replace("{pluginId}", encodeURIComponent("" + pluginId));
    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processGetDetails(_response);
 
    });
}


function Plugin_processGetDetails(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginSpecResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @param expand (optional) 
     * @param filter (optional) 
     * @param sort (optional) 
     * @param pageIndex (optional) 
     * @param pageSize (optional) 
     * @return OK
     */
        
export async function Plugin_getInstalledPluginList(expand:string[] | undefined, filter:FilterTuple[] | undefined, sort:{ [key: string]: string; } | undefined, pageIndex:number | undefined, pageSize:number | undefined ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
    };

    let url_ = baseUrl + "Plugin/GetInstalledPluginList";

        
        
    
        
        
    
        
        
    
        
        
    
        
        
    


                        url_ += buildEndpointQueryString({ expand,  filter,  sort,  pageIndex,  pageSize});
        
        
        
        
        
        


    if (expand === null)
        throw new Error("The parameter 'expand' cannot be null.");
    if (filter === null)
        throw new Error("The parameter 'filter' cannot be null.");
    if (sort === null)
        throw new Error("The parameter 'sort' cannot be null.");
    if (pageIndex === null)
        throw new Error("The parameter 'pageIndex' cannot be null.");
    if (pageSize === null)
        throw new Error("The parameter 'pageSize' cannot be null.");
    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processGetInstalledPluginList(_response);
 
    });
}


function Plugin_processGetInstalledPluginList(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodePluginListResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @param expand (optional) 
     * @param filter (optional) 
     * @param sort (optional) 
     * @param pageIndex (optional) 
     * @param pageSize (optional) 
     * @return OK
     */
        
export async function Plugin_getAvailablePluginList(expand:string[] | undefined, filter:FilterTuple[] | undefined, sort:{ [key: string]: string; } | undefined, pageIndex:number | undefined, pageSize:number | undefined ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
    };

    let url_ = baseUrl + "Plugin/GetAvailablePluginList";

        
        
    
        
        
    
        
        
    
        
        
    
        
        
    


                        url_ += buildEndpointQueryString({ expand,  filter,  sort,  pageIndex,  pageSize});
        
        
        
        
        
        


    if (expand === null)
        throw new Error("The parameter 'expand' cannot be null.");
    if (filter === null)
        throw new Error("The parameter 'filter' cannot be null.");
    if (sort === null)
        throw new Error("The parameter 'sort' cannot be null.");
    if (pageIndex === null)
        throw new Error("The parameter 'pageIndex' cannot be null.");
    if (pageSize === null)
        throw new Error("The parameter 'pageSize' cannot be null.");
    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processGetAvailablePluginList(_response);
 
    });
}


function Plugin_processGetAvailablePluginList(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodePluginListResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @return OK
     */
        
export async function Plugin_getInstalledPluginDetails(pluginId:number ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
      next: { revalidate: 0 },
    };

    let url_ = baseUrl + "Plugin/GetInstalledPluginDetails/{pluginId}";

    if (pluginId === undefined || pluginId === null)
        throw new Error("The parameter 'pluginId' must be defined.");
    url_ = url_.replace("{pluginId}", encodeURIComponent("" + pluginId));
    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processGetInstalledPluginDetails(_response);
 
    });
}


function Plugin_processGetInstalledPluginDetails(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginDetailResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @param body (optional) 
     * @return OK
     */

    export async function Plugin_editInstalledPlugin(body:Models.PluginDetailModel | undefined): Promise<any> {

    let url_ = baseUrl + "Plugin/EditInstalledPlugin";

    url_ = url_.replace(/[?&]$/, "");

 const content_ = JSON.stringify(body);

     let options_: RequestInit = {
        body: content_,
        method: "PUT",
        headers: await getHeaders("PUT", String(baseUrl)),
        next: { revalidate: 0 },
    };

    return fetch(url_, options_).then((_response: Response) => {

        return Plugin_processEditInstalledPlugin(_response);
    });
}

function Plugin_processEditInstalledPlugin(response: Response): Promise<any> {
   const status = response.status;
   let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTrueFalseResponse;
    return result200;
    });
} else if (status === 201) {
    return response.text().then((_responseText) => {
    let result201: any = null;
    result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTrueFalseResponse;
    return result201;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @param body (optional) 
     * @return OK
     */

    export async function Plugin_updateGlobalConfiguration(pluginId:number, body:string | undefined): Promise<any> {

    let url_ = baseUrl + "Plugin/UpdateGlobalConfiguration/{pluginId}";

    if (pluginId === undefined || pluginId === null)
        throw new Error("The parameter 'pluginId' must be defined.");
    url_ = url_.replace("{pluginId}", encodeURIComponent("" + pluginId));
    url_ = url_.replace(/[?&]$/, "");

 const content_ = JSON.stringify(body);

     let options_: RequestInit = {
        body: content_,
        method: "PUT",
        headers: await getHeaders("PUT", String(baseUrl)),
        next: { revalidate: 0 },
    };

    return fetch(url_, options_).then((_response: Response) => {

        return Plugin_processUpdateGlobalConfiguration(_response);
    });
}

function Plugin_processUpdateGlobalConfiguration(response: Response): Promise<any> {
   const status = response.status;
   let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTrueFalseResponse;
    return result200;
    });
} else if (status === 201) {
    return response.text().then((_responseText) => {
    let result201: any = null;
    result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTrueFalseResponse;
    return result201;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @param body (optional) 
     * @return OK
     */

    export async function Plugin_updateStoreLevelConfiguration(pluginId:number, portalId:number, body:string | undefined): Promise<any> {

    let url_ = baseUrl + "Plugin/UpdateStoreLevelConfiguration/{pluginId}/{portalId}";

    if (pluginId === undefined || pluginId === null)
        throw new Error("The parameter 'pluginId' must be defined.");
    url_ = url_.replace("{pluginId}", encodeURIComponent("" + pluginId));
    if (portalId === undefined || portalId === null)
        throw new Error("The parameter 'portalId' must be defined.");
    url_ = url_.replace("{portalId}", encodeURIComponent("" + portalId));
    url_ = url_.replace(/[?&]$/, "");

 const content_ = JSON.stringify(body);

     let options_: RequestInit = {
        body: content_,
        method: "PUT",
        headers: await getHeaders("PUT", String(baseUrl)),
        next: { revalidate: 0 },
    };

    return fetch(url_, options_).then((_response: Response) => {

        return Plugin_processUpdateStoreLevelConfiguration(_response);
    });
}

function Plugin_processUpdateStoreLevelConfiguration(response: Response): Promise<any> {
   const status = response.status;
   let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTrueFalseResponse;
    return result200;
    });
} else if (status === 201) {
    return response.text().then((_responseText) => {
    let result201: any = null;
    result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTrueFalseResponse;
    return result201;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @return OK
     */
        
export async function Plugin_template(pluginDetailsId:number ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
      next: { revalidate: 0 },
    };

    let url_ = baseUrl + "Plugin/Template/{pluginDetailsId}";

    if (pluginDetailsId === undefined || pluginDetailsId === null)
        throw new Error("The parameter 'pluginDetailsId' must be defined.");
    url_ = url_.replace("{pluginDetailsId}", encodeURIComponent("" + pluginDetailsId));
    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processTemplate(_response);
 
    });
}


function Plugin_processTemplate(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTemplateResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @return OK
     */
        
export async function Plugin_types( ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
      next: { revalidate: 0 },
    };

    let url_ = baseUrl + "Plugin/Types";

    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processTypes(_response);
 
    });
}


function Plugin_processTypes(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginTypeResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
     * @return OK
     */
        
export async function Plugin_scopes( ): Promise<any> {


    let options_: RequestInit = {
      method: "GET",
      cache: "no-store",
      headers: await getHeaders("GET", String(baseUrl)),
      next: { revalidate: 0 },
    };

    let url_ = baseUrl + "Plugin/Scopes";

    url_ = url_.replace(/[?&]$/, "");


    return fetch(url_, options_).then((_response: Response) => {
       
       return Plugin_processScopes(_response);
 
    });
}


function Plugin_processScopes(response: Response): Promise<any> {
  const status = response.status;
  let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
if (status === 200) {
    return response.text().then((_responseText) => {
    let result200: any = null;
    result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PluginScopeResponse;
    return result200;
    });
} else if (status === 204) {
    return response.text().then((_responseText) => {
    let result204: any = null;
    result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("No Content", status, _responseText, _headers, result204);
    });
} else if (status === 500) {
    return response.text().then((_responseText) => {
    let result500: any = null;
    result500 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
    return throwException("Internal Server Error", status, _responseText, _headers, result500);
    });
} else if (status !== 200 && status !== 204) {
    return response.text().then((_responseText) => {
    return throwException("An unexpected server error occurred.", status, _responseText, _headers);
    });
}
return Promise.resolve<any>(null as any);
  
  
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
try{
if (result !== null && result !== undefined)
    throw result;

else
    throw new Error(message);
}
catch(ex)
{
const parsedRes = response === "" ? null : JSON.parse(response) as any;
return parsedRes;
}
}
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

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
         * Get attribute List
         * @param expand (optional) 
         * @param filter (optional) 
         * @param sort (optional) 
         * @param pageIndex (optional) 
         * @param pageSize (optional) 
         * @return OK
         */
            
export async function PIMAttribute_list(expand:string[] | undefined, filter:FilterTuple[] | undefined, sort:{ [key: string]: string; } | undefined, pageIndex:number | undefined, pageSize:number | undefined ): Promise<MultifrontTypes.PIMAttributeListResponse> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
        };

        let url_ = baseUrl + "PIMAttribute/List";
    
            
            
        
            
            
        
            
            
        
            
            
        
            
            
        
    
    
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
           
           return PIMAttribute_processList(_response);
     
        });
    }
   
   
  function PIMAttribute_processList(response: Response): Promise<MultifrontTypes.PIMAttributeListResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeListResponse;
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
         * get attribute by attribute id
         * @param id Attribute id
         * @param expand (optional) 
         * @return OK
         */
            
export async function PIMAttribute_get(id:number, expand:string[] | undefined ): Promise<MultifrontTypes.PIMAttributeResponse> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/Get/{id}";
    
            
            
        
    
    
                            url_ += buildEndpointQueryString({ expand});
            
            
    

        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        if (expand === null)
            throw new Error("The parameter 'expand' cannot be null.");
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processGet(_response);
     
        });
    }
   
   
  function PIMAttribute_processGet(response: Response): Promise<MultifrontTypes.PIMAttributeResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeResponse;
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
         * Create Attribute
         * @param body (optional) model with attribute data
         * @return OK
         */
    
        export async function PIMAttribute_create(body:Models.PIMAttributeDataModel | undefined): Promise<MultifrontTypes.PIMAttributeDataResponse> {

        let url_ = baseUrl + "PIMAttribute/Create";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "POST",
            cache: "no-store",
            headers: await getHeaders("POST", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processCreate(_response);
        });
    }
   
   function PIMAttribute_processCreate(response: Response): Promise<MultifrontTypes.PIMAttributeDataResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result200;
        });
    } else if (status === 201) {
        return response.text().then((_responseText) => {
        let result201: any = null;
        result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result201;
        });
    } else if (status !== 200 && status !== 204) {
        return response.text().then((_responseText) => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        });
    }
    return Promise.resolve<any>(null as any);
  
    }

    
    
    
        
    
    
    /**
         * Save attribute Locale values
         * @param body (optional) PIM Attribute Locale List Model
         * @return OK
         */
    
        export async function PIMAttribute_saveLocales(body:Models.PIMAttributeLocaleListModel | undefined): Promise<MultifrontTypes.PIMAttributeDataResponse> {

        let url_ = baseUrl + "PIMAttribute/SaveLocales";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "POST",
            cache: "no-store",
            headers: await getHeaders("POST", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processSaveLocales(_response);
        });
    }
   
   function PIMAttribute_processSaveLocales(response: Response): Promise<MultifrontTypes.PIMAttributeDataResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result200;
        });
    } else if (status === 201) {
        return response.text().then((_responseText) => {
        let result201: any = null;
        result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result201;
        });
    } else if (status !== 200 && status !== 204) {
        return response.text().then((_responseText) => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        });
    }
    return Promise.resolve<any>(null as any);
  
    }

    
    
    
        
    
    
    /**
         * save Attribute Default values
         * @param body (optional) PIM Attribute Default Value Model
         * @return OK
         */
    
        export async function PIMAttribute_saveDefaultValues(body:Models.PIMAttributeDefaultValueModel | undefined): Promise<MultifrontTypes.PIMAttributeDataResponse> {

        let url_ = baseUrl + "PIMAttribute/SaveDefaultValues";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "POST",
            cache: "no-store",
            headers: await getHeaders("POST", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processSaveDefaultValues(_response);
        });
    }
   
   function PIMAttribute_processSaveDefaultValues(response: Response): Promise<MultifrontTypes.PIMAttributeDataResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result200;
        });
    } else if (status === 201) {
        return response.text().then((_responseText) => {
        let result201: any = null;
        result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result201;
        });
    } else if (status !== 200 && status !== 204) {
        return response.text().then((_responseText) => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        });
    }
    return Promise.resolve<any>(null as any);
  
    }

    
    
    
        
    
    
    /**
         * Delete Default Attribute Id
         * @param defaultvalueId PIM attribute Default Value Id
         * @return OK
         */
            
export async function PIMAttribute_deleteDefaultValues(defaultvalueId:number ): Promise<MultifrontTypes.TrueFalseResponse> {
 

        let url_ = baseUrl + "PIMAttribute/DeleteDefaultValues/{defaultvalueId}";

        if (defaultvalueId === undefined || defaultvalueId === null)
            throw new Error("The parameter 'defaultvalueId' must be defined.");
        url_ = url_.replace("{defaultvalueId}", encodeURIComponent("" + defaultvalueId));
        url_ = url_.replace(/[?&]$/, "");

         let options_: RequestInit = {
            method: "DELETE",
            cache: "no-store",
            headers: await getHeaders("DELETE", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processDeleteDefaultValues(_response);
     
        });
    }
   
   
  function PIMAttribute_processDeleteDefaultValues(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Update attribute data
         * @param body (optional) model with attribute details
         * @return OK
         */
    
        export async function PIMAttribute_update(body:Models.PIMAttributeDataModel | undefined): Promise<MultifrontTypes.PIMAttributeDataResponse> {

        let url_ = baseUrl + "PIMAttribute/Update";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: await getHeaders("PUT", String(baseUrl)),
            next: { revalidate: 0 },
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processUpdate(_response);
        });
    }
   
   function PIMAttribute_processUpdate(response: Response): Promise<MultifrontTypes.PIMAttributeDataResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result200;
        });
    } else if (status === 201) {
        return response.text().then((_responseText) => {
        let result201: any = null;
        result201 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeDataResponse;
        return result201;
        });
    } else if (status !== 200 && status !== 204) {
        return response.text().then((_responseText) => {
        return throwException("An unexpected server error occurred.", status, _responseText, _headers);
        });
    }
    return Promise.resolve<any>(null as any);
  
    }

    
    
    
        
    
    
    /**
         * Delete PIM Attribute Ids.
         * @param body (optional) Parameter Model for PIM attribute Ids.
         * @return OK
         */
    
        export async function PIMAttribute_delete(body:Models.ParameterModel | undefined): Promise<MultifrontTypes.TrueFalseResponse> {

        let url_ = baseUrl + "PIMAttribute/Delete";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "POST",
            cache: "no-store",
            headers: await getHeaders("POST", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processDelete(_response);
        });
    }
   
   function PIMAttribute_processDelete(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Gets list of attributes.
         * @return OK
         */
            
export async function PIMAttribute_attributeTypes(isCategory:boolean ): Promise<MultifrontTypes.PIMAttributeListResponse> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/AttributeTypes/{isCategory}";

        if (isCategory === undefined || isCategory === null)
            throw new Error("The parameter 'isCategory' must be defined.");
        url_ = url_.replace("{isCategory}", encodeURIComponent("" + isCategory));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processAttributeTypes(_response);
     
        });
    }
   
   
  function PIMAttribute_processAttributeTypes(response: Response): Promise<MultifrontTypes.PIMAttributeListResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeListResponse;
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
         * Gets list of attributes validations.
         * @param typeId Id of type
         * @param attributeId attribute Id
         * @return OK
         */
            
export async function PIMAttribute_inputValidations(typeId:number, attributeId:number ): Promise<MultifrontTypes.PIMAttributeListResponse> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/InputValidations/{typeId}/{attributeId}";

        if (typeId === undefined || typeId === null)
            throw new Error("The parameter 'typeId' must be defined.");
        url_ = url_.replace("{typeId}", encodeURIComponent("" + typeId));
        if (attributeId === undefined || attributeId === null)
            throw new Error("The parameter 'attributeId' must be defined.");
        url_ = url_.replace("{attributeId}", encodeURIComponent("" + attributeId));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processInputValidations(_response);
     
        });
    }
   
   
  function PIMAttribute_processInputValidations(response: Response): Promise<MultifrontTypes.PIMAttributeListResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeListResponse;
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
         * Get Front End Properties By Attribute id
         * @param pimAttributeId Pim Attribute Id
         * @return OK
         */
            
export async function PIMAttribute_frontEndProperties(pimAttributeId:number ): Promise<MultifrontTypes.PIMFrontPropertiesResponse> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/FrontEndProperties/{pimAttributeId}";

        if (pimAttributeId === undefined || pimAttributeId === null)
            throw new Error("The parameter 'pimAttributeId' must be defined.");
        url_ = url_.replace("{pimAttributeId}", encodeURIComponent("" + pimAttributeId));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processFrontEndProperties(_response);
     
        });
    }
   
   
  function PIMAttribute_processFrontEndProperties(response: Response): Promise<MultifrontTypes.PIMFrontPropertiesResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMFrontPropertiesResponse;
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
         * Gets list of attributes validations.
         * @param pimAttributeId Pim Attribute Id
         * @return OK
         */
            
export async function PIMAttribute_getAttributeLocale(pimAttributeId:number ): Promise<MultifrontTypes.PIMAttributeLocaleListResponce> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/GetAttributeLocale/{pimAttributeId}";

        if (pimAttributeId === undefined || pimAttributeId === null)
            throw new Error("The parameter 'pimAttributeId' must be defined.");
        url_ = url_.replace("{pimAttributeId}", encodeURIComponent("" + pimAttributeId));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processGetAttributeLocale(_response);
     
        });
    }
   
   
  function PIMAttribute_processGetAttributeLocale(response: Response): Promise<MultifrontTypes.PIMAttributeLocaleListResponce> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeLocaleListResponce;
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
         * Gets list of attributes validations.
         * @param pimAttributeId Pim Attribute Id
         * @return OK
         */
            
export async function PIMAttribute_getDefaultValues(pimAttributeId:number ): Promise<MultifrontTypes.PIMAttributeLocaleListResponce> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/GetDefaultValues/{pimAttributeId}";

        if (pimAttributeId === undefined || pimAttributeId === null)
            throw new Error("The parameter 'pimAttributeId' must be defined.");
        url_ = url_.replace("{pimAttributeId}", encodeURIComponent("" + pimAttributeId));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processGetDefaultValues(_response);
     
        });
    }
   
   
  function PIMAttribute_processGetDefaultValues(response: Response): Promise<MultifrontTypes.PIMAttributeLocaleListResponce> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeLocaleListResponce;
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
         * Check attribute Code already exist or not
         * @param attributeCode attributeCode
         * @param isCategory true for category attribute else false
         * @return OK
         */
            
export async function PIMAttribute_isAttributeCodeExist(attributeCode:string, isCategory:boolean ): Promise<MultifrontTypes.TrueFalseResponse> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PIMAttribute/IsAttributeCodeExist/{attributeCode}/{isCategory}";

        if (attributeCode === undefined || attributeCode === null)
            throw new Error("The parameter 'attributeCode' must be defined.");
        url_ = url_.replace("{attributeCode}", encodeURIComponent("" + attributeCode));
        if (isCategory === undefined || isCategory === null)
            throw new Error("The parameter 'isCategory' must be defined.");
        url_ = url_.replace("{isCategory}", encodeURIComponent("" + isCategory));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PIMAttribute_processIsAttributeCodeExist(_response);
     
        });
    }
   
   
  function PIMAttribute_processIsAttributeCodeExist(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Check attribute Code already exist or not
         * @param body (optional) attributeCode
         * @return OK
         */
    
        export async function PIMAttribute_isAttributeValueUnique(body:Models.PimAttributeValueParameterModel | undefined): Promise<MultifrontTypes.StringResponse> {

        let url_ = baseUrl + "PIMAttribute/IsAttributeValueUnique";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "POST",
            cache: "no-store",
            headers: await getHeaders("POST", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processIsAttributeValueUnique(_response);
        });
    }
   
   function PIMAttribute_processIsAttributeValueUnique(response: Response): Promise<MultifrontTypes.StringResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.StringResponse;
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
         * Get attribute validation by attribute code.
         * @param body (optional) PIMFamily Model
         * @return OK
         */
    
        export async function PIMAttribute_getAttributeValidationByCodes(body:Models.ParameterProductModel | undefined): Promise<MultifrontTypes.PIMAttributeFamilyResponse> {

        let url_ = baseUrl + "PIMAttribute/GetAttributeValidationByCodes";

        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "POST",
            cache: "no-store",
            headers: await getHeaders("POST", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PIMAttribute_processGetAttributeValidationByCodes(_response);
        });
    }
   
   function PIMAttribute_processGetAttributeValidationByCodes(response: Response): Promise<MultifrontTypes.PIMAttributeFamilyResponse> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeFamilyResponse;
        return result200;
        });
    } else if (status === 204) {
        return response.text().then((_responseText) => {
        let result204: any = null;
        result204 = _responseText === "" ? null : JSON.parse(_responseText) as Models.ZnodeErrorDetail;
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
         * Gets list of attributes validations.
         * @param expand (optional) 
         * @param filter (optional) 
         * @param sort (optional) 
         * @param pageIndex (optional) 
         * @param pageSize (optional) 
         * @return OK
         */
            
export async function PIMAttribute_getAttributeDefaultValueList(expand:string[] | undefined, filter:FilterTuple[] | undefined, sort:{ [key: string]: string; } | undefined, pageIndex:number | undefined, pageSize:number | undefined ): Promise<MultifrontTypes.PIMAttributeLocaleListResponce> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
        };

        let url_ = baseUrl + "PIMAttribute/GetAttributeDefaultValueList";
    
            
            
        
            
            
        
            
            
        
            
            
        
            
            
        
    
    
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
           
           return PIMAttribute_processGetAttributeDefaultValueList(_response);
     
        });
    }
   
   
  function PIMAttribute_processGetAttributeDefaultValueList(response: Response): Promise<MultifrontTypes.PIMAttributeLocaleListResponce> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PIMAttributeLocaleListResponce;
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
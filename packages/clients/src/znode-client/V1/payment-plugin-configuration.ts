//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
//import { CONFIG } from "constants/index";
const baseUrl = process.env.API_URL;
import { addCacheOption,buildEndpointQueryString,getHeaders } from "./base";
import * as Models from "../../types/multifront-types";
import {FilterTuple} from "@znode/clients/v1";

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

    /**
         * @param expand (optional) 
         * @param filter (optional) 
         * @param sort (optional) 
         * @param pageIndex (optional) 
         * @param pageSize (optional) 
         * @return OK
         */
            
    export async function PaymentPluginConfiguration_associatedConfigurationSetsGet(pluginTypes:string, pluginScope:string, externalId:number, expand:string[] | undefined, filter:FilterTuple[] | undefined, sort:{ [key: string]: string; } | undefined, pageIndex:number | undefined, pageSize:number | undefined ): Promise<any> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
        };

        let url_ = baseUrl + "AssociatedConfigurationSets/{pluginTypes}/{pluginScope}/{externalId}";
    
        url_ += buildEndpointQueryString({ expand,  filter,  sort,  pageIndex,  pageSize});

        if (pluginTypes === undefined || pluginTypes === null)
            throw new Error("The parameter 'pluginTypes' must be defined.");
        url_ = url_.replace("{pluginTypes}", encodeURIComponent("" + pluginTypes));
        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        if (externalId === undefined || externalId === null)
            throw new Error("The parameter 'externalId' must be defined.");
        url_ = url_.replace("{externalId}", encodeURIComponent("" + externalId));
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
           
           return PaymentPluginConfiguration_processAssociatedConfigurationSetsGet(_response);
     
        });
    }
   
   
  function PaymentPluginConfiguration_processAssociatedConfigurationSetsGet(response: Response): Promise<any> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PaymentConfigurationListResponse;
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
         * Associate configuration sets to store or profile
         * @param configurationSetCodes Configuration Set Codes.
         * @param pluginType Plugin type
         * @param pluginScope Plugin scope
         * @param externalId External Id
         * @return OK
         */
    
        export async function PaymentPluginConfiguration_associateConfigurationSets(configurationSetCodes:string, pluginType:string, pluginScope:string, externalId:number): Promise<any> {

        let url_ = baseUrl + "AssociateConfigurationSets/{configurationSetCodes}/{pluginType}/{pluginScope}/{externalId}";

        if (configurationSetCodes === undefined || configurationSetCodes === null)
            throw new Error("The parameter 'configurationSetCodes' must be defined.");
        url_ = url_.replace("{configurationSetCodes}", encodeURIComponent("" + configurationSetCodes));
        if (pluginType === undefined || pluginType === null)
            throw new Error("The parameter 'pluginType' must be defined.");
        url_ = url_.replace("{pluginType}", encodeURIComponent("" + pluginType));
        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        if (externalId === undefined || externalId === null)
            throw new Error("The parameter 'externalId' must be defined.");
        url_ = url_.replace("{externalId}", encodeURIComponent("" + externalId));
        url_ = url_.replace(/[?&]$/, "");

         let options_: RequestInit = {
            method: "PUT",
            headers: await getHeaders("PUT", String(baseUrl)),
            next: { revalidate: 0 },
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PaymentPluginConfiguration_processAssociateConfigurationSets(_response);
        });
    }
   
   function PaymentPluginConfiguration_processAssociateConfigurationSets(response: Response): Promise<any> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Associate payment configuration sets to store for offline payments
         * @param configurationSetCodes Configuration Set Codes.
         * @param pluginScope Plugin scope
         * @param externalId External Id
         * @return OK
         */
    
        export async function PaymentPluginConfiguration_associateConfigurationSetsForOfflinePayment(configurationSetCodes:string, pluginScope:string, externalId:number): Promise<any> {

        let url_ = baseUrl + "AssociateConfigurationSetsForOfflinePayment/{configurationSetCodes}/{pluginScope}/{externalId}";

        if (configurationSetCodes === undefined || configurationSetCodes === null)
            throw new Error("The parameter 'configurationSetCodes' must be defined.");
        url_ = url_.replace("{configurationSetCodes}", encodeURIComponent("" + configurationSetCodes));
        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        if (externalId === undefined || externalId === null)
            throw new Error("The parameter 'externalId' must be defined.");
        url_ = url_.replace("{externalId}", encodeURIComponent("" + externalId));
        url_ = url_.replace(/[?&]$/, "");

         let options_: RequestInit = {
            method: "PUT",
            headers: await getHeaders("PUT", String(baseUrl)),
            next: { revalidate: 0 },
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PaymentPluginConfiguration_processAssociateConfigurationSetsForOfflinePayment(_response);
        });
    }
   
   function PaymentPluginConfiguration_processAssociateConfigurationSetsForOfflinePayment(response: Response): Promise<any> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Deletes the associated configuration sets based on the provided configuration set ID, plugin scope and external Id.
         * @param configurationSetCode The Code of the configuration set to delete.
         * @param pluginType Plugin type
         * @param pluginScope Plugin scope
         * @param externalId The external ID associated with the configuration set.
         * @return OK
         */
            
export async function PaymentPluginConfiguration_associatedConfigurationSet(configurationSetCode:string, pluginType:string, pluginScope:string, externalId:number ): Promise<any> {
 

        let url_ = baseUrl + "AssociatedConfigurationSet/{configurationSetCode}/{pluginType}/{pluginScope}/{externalId}";

        if (configurationSetCode === undefined || configurationSetCode === null)
            throw new Error("The parameter 'configurationSetCode' must be defined.");
        url_ = url_.replace("{configurationSetCode}", encodeURIComponent("" + configurationSetCode));
        if (pluginType === undefined || pluginType === null)
            throw new Error("The parameter 'pluginType' must be defined.");
        url_ = url_.replace("{pluginType}", encodeURIComponent("" + pluginType));
        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        if (externalId === undefined || externalId === null)
            throw new Error("The parameter 'externalId' must be defined.");
        url_ = url_.replace("{externalId}", encodeURIComponent("" + externalId));
        url_ = url_.replace(/[?&]$/, "");

         let options_: RequestInit = {
            method: "DELETE",
            cache: "no-store",
            headers: await getHeaders("DELETE", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
           
           return PaymentPluginConfiguration_processAssociatedConfigurationSet(_response);
     
        });
    }
   
   
  function PaymentPluginConfiguration_processAssociatedConfigurationSet(response: Response): Promise<any> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Deletes the associated configuration sets for offline payment based on configuration set codes, scope and external Id.
         * @param configurationSetCodes Comma separated configuration set codes
         * @param pluginScope Plugin scope
         * @param externalId The external ID associated with the configuration set.
         * @return OK
         */
            
export async function PaymentPluginConfiguration_associatedConfigurationSetsForOfflinePayment(configurationSetCodes:string, pluginScope:string, externalId:number ): Promise<any> {
 

        let url_ = baseUrl + "AssociatedConfigurationSetsForOfflinePayment/{configurationSetCodes}/{pluginScope}/{externalId}";

        if (configurationSetCodes === undefined || configurationSetCodes === null)
            throw new Error("The parameter 'configurationSetCodes' must be defined.");
        url_ = url_.replace("{configurationSetCodes}", encodeURIComponent("" + configurationSetCodes));
        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        if (externalId === undefined || externalId === null)
            throw new Error("The parameter 'externalId' must be defined.");
        url_ = url_.replace("{externalId}", encodeURIComponent("" + externalId));
        url_ = url_.replace(/[?&]$/, "");

         let options_: RequestInit = {
            method: "DELETE",
            cache: "no-store",
            headers: await getHeaders("DELETE", String(baseUrl)),
        };

        return fetch(url_, options_).then((_response: Response) => {
           
           return PaymentPluginConfiguration_processAssociatedConfigurationSetsForOfflinePayment(_response);
     
        });
    }
   
   
  function PaymentPluginConfiguration_processAssociatedConfigurationSetsForOfflinePayment(response: Response): Promise<any> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Updates the associated configuration sets for the specified payment configuration set model.
         * @param pluginScope Plugin scope
         * @param body (optional) The model containing the details of the payment configuration set to update.
         * @return OK
         */
    
        export async function PaymentPluginConfiguration_associatedConfigurationSetsPut(pluginScope:string, body:Models.AssociatedConfigurationSetUpdateRequest | undefined): Promise<any> {

        let url_ = baseUrl + "AssociatedConfigurationSets/{pluginScope}";

        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        url_ = url_.replace(/[?&]$/, "");

     const content_ = JSON.stringify(body);

         let options_: RequestInit = {
            body: content_,
            method: "PUT",
            headers: await getHeaders("PUT", String(baseUrl)),
            next: { revalidate: 0 },
        };

        return fetch(url_, options_).then((_response: Response) => {
   
            return PaymentPluginConfiguration_processAssociatedConfigurationSetsPut(_response);
        });
    }
   
   function PaymentPluginConfiguration_processAssociatedConfigurationSetsPut(response: Response): Promise<any> {
       const status = response.status;
       let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.TrueFalseResponse;
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
         * Retrieves the list of unassociated configuration sets.
         * @param pluginTypes Comma separated plugin types
         * @param pluginScope Plugin scope
         * @param externalId External Id
         * @param expand (optional) Expand options for querying the database.
         * @param filter (optional) Collection of filters to apply when retrieving the payment configuration sets.
         * @param sort (optional) Sorting criteria to determine the order of records.
         * @param pageIndex (optional) Page index for pagination.
         * @param pageSize (optional) Number of items per page in paginated results.
         * @return OK
         */
            
export async function PaymentPluginConfiguration_unAssociatedConfigurationSets(pluginTypes:string, pluginScope:string, externalId:number, expand:string[] | undefined, filter:FilterTuple[] | undefined, sort:{ [key: string]: string; } | undefined, pageIndex:number | undefined, pageSize:number | undefined ): Promise<any> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
        };

        let url_ = baseUrl + "UnAssociatedConfigurationSets/{pluginTypes}/{pluginScope}/{externalId}";
    
            
            
        
            
            
        
            
            
        
            
            
        
            
            
        
    
    
                            url_ += buildEndpointQueryString({ expand,  filter,  sort,  pageIndex,  pageSize});
            
            
            
            
            
            
    

        if (pluginTypes === undefined || pluginTypes === null)
            throw new Error("The parameter 'pluginTypes' must be defined.");
        url_ = url_.replace("{pluginTypes}", encodeURIComponent("" + pluginTypes));
        if (pluginScope === undefined || pluginScope === null)
            throw new Error("The parameter 'pluginScope' must be defined.");
        url_ = url_.replace("{pluginScope}", encodeURIComponent("" + pluginScope));
        if (externalId === undefined || externalId === null)
            throw new Error("The parameter 'externalId' must be defined.");
        url_ = url_.replace("{externalId}", encodeURIComponent("" + externalId));
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
           
           return PaymentPluginConfiguration_processUnAssociatedConfigurationSets(_response);
     
        });
    }
   
   
  function PaymentPluginConfiguration_processUnAssociatedConfigurationSets(response: Response): Promise<any> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PaymentConfigurationListResponse;
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
         * Gets the list of payment method based on portal Id and user Id.
         * @param portalId Portal Id
         * @param userId User Id
         * @return OK
         */
            
export async function PaymentPluginConfiguration_paymentMethods(portalId:number, userId:number ): Promise<any> {
 

        let options_: RequestInit = {
          method: "GET",
          cache: "no-store",
          headers: await getHeaders("GET", String(baseUrl)),
          next: { revalidate: 0 },
        };

        let url_ = baseUrl + "PaymentMethods/{portalId}/{userId}";

        if (portalId === undefined || portalId === null)
            throw new Error("The parameter 'portalId' must be defined.");
        url_ = url_.replace("{portalId}", encodeURIComponent("" + portalId));
        if (userId === undefined || userId === null)
            throw new Error("The parameter 'userId' must be defined.");
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        url_ = url_.replace(/[?&]$/, "");

 
        return fetch(url_, options_).then((_response: Response) => {
           
           return PaymentPluginConfiguration_processPaymentMethods(_response);
     
        });
    }
   
   
  function PaymentPluginConfiguration_processPaymentMethods(response: Response): Promise<any> {
      const status = response.status;
      let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
    if (status === 200) {
        return response.text().then((_responseText) => {
        let result200: any = null;
        result200 = _responseText === "" ? null : JSON.parse(_responseText) as Models.PaymentConfigurationListResponse;
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
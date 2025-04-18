//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

import * as Models from "../../types/multifront-types";
import * as MultifrontTypes from "../../types/multifront-types";

import { addCacheOption, buildEndpointQueryString, getHeaders } from "./base";

import { FilterTuple } from "../../types/multifront-types";

const baseUrl = process.env.API_URL;

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

/**
 * Gets list of categories.
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function Category_list(
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.CategoryListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "Category/List";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processList(_response);
  });
}

function Category_processList(response: Response): Promise<MultifrontTypes.CategoryListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryListResponse);
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
 * Gets a category.
 * @param categoryId ID of category to be retrieved.
 * @param familyId Family Id.
 * @param localeId Active locale Id
 * @return OK
 */

export async function Category_get(categoryId: number, familyId: number, localeId: number): Promise<MultifrontTypes.PIMAttributeFamilyResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
    next: { revalidate: 0 },
  };

  let url_ = baseUrl + "Category/Get/{categoryId}/{familyId}/{localeId}";

  if (categoryId === undefined || categoryId === null) throw new Error("The parameter 'categoryId' must be defined.");
  url_ = url_.replace("{categoryId}", encodeURIComponent("" + categoryId));
  if (familyId === undefined || familyId === null) throw new Error("The parameter 'familyId' must be defined.");
  url_ = url_.replace("{familyId}", encodeURIComponent("" + familyId));
  if (localeId === undefined || localeId === null) throw new Error("The parameter 'localeId' must be defined.");
  url_ = url_.replace("{localeId}", encodeURIComponent("" + localeId));
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processGet(_response);
  });
}

function Category_processGet(response: Response): Promise<MultifrontTypes.PIMAttributeFamilyResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.PIMAttributeFamilyResponse);
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
 * Method to create category.
 * @param body (optional) Category model.
 * @return OK
 */

export async function Category_create(body: Models.CategoryValuesListModel | undefined): Promise<MultifrontTypes.CategoryResponse> {
  let url_ = baseUrl + "Category/Create";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processCreate(_response);
  });
}

function Category_processCreate(response: Response): Promise<MultifrontTypes.CategoryResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryResponse);
      return result200;
    });
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryResponse);
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
 * Method to update category.
 * @param body (optional) Category model to be updated.
 * @return OK
 */

export async function Category_update(body: Models.CategoryValuesListModel | undefined): Promise<MultifrontTypes.CategoryResponse> {
  let url_ = baseUrl + "Category/Update";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "PUT",
    headers: await getHeaders("PUT", String(baseUrl)),
    next: { revalidate: 0 },
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processUpdate(_response);
  });
}

function Category_processUpdate(response: Response): Promise<MultifrontTypes.CategoryResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryResponse);
      return result200;
    });
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryResponse);
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
 * Method to delete category.
 * @param body (optional) IDs of category to be deleted.
 * @return OK
 */

export async function Category_delete(body: Models.ParameterModel | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Category/Delete";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processDelete(_response);
  });
}

function Category_processDelete(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
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
 * Delete Category Product
 * @param body (optional) PimCategoryProductId
 * @return OK
 */

export async function Category_deleteCategoryProduct(body: Models.ParameterModel | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Category/DeleteCategoryProduct";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processDeleteCategoryProduct(_response);
  });
}

function Category_processDeleteCategoryProduct(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
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
 * Delete Associated Categories To Product
 * @param body (optional)
 * @return OK
 */

export async function Category_deleteAssociatedCategoriesToProduct(body: Models.ParameterModel | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Category/DeleteAssociatedCategoriesToProduct";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processDeleteAssociatedCategoriesToProduct(_response);
  });
}

function Category_processDeleteAssociatedCategoriesToProduct(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
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
 * Associate Category Product
 * @param body (optional) listModel
 * @return OK
 */

export async function Category_associateCategoryProduct(body: Models.CategoryProductModel[] | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Category/AssociateCategoryProduct";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processAssociateCategoryProduct(_response);
  });
}

function Category_processAssociateCategoryProduct(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
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
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.TrueFalseResponse);
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
 * Associate Categories to  Product
 * @param body (optional) listModel
 * @return OK
 */

export async function Category_associateCategoriesToProduct(body: Models.CategoryProductModel[] | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Category/AssociateCategoriesToProduct";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processAssociateCategoriesToProduct(_response);
  });
}

function Category_processAssociateCategoriesToProduct(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
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
  } else if (status === 201) {
    return response.text().then((_responseText) => {
      let result201: any = null;
      result201 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.TrueFalseResponse);
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
 * Get associated or unassociated Products with Category.
 * @param categoryId category id
 * @param associatedProducts associatedProducts
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function Category_getAssociatedUnAssociatedCategoryProducts(
  categoryId: number,
  associatedProducts: boolean,
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.CategoryProductListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "Category/GetAssociatedUnAssociatedCategoryProducts/{categoryId}/{associatedProducts}";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (categoryId === undefined || categoryId === null) throw new Error("The parameter 'categoryId' must be defined.");
  url_ = url_.replace("{categoryId}", encodeURIComponent("" + categoryId));
  if (associatedProducts === undefined || associatedProducts === null) throw new Error("The parameter 'associatedProducts' must be defined.");
  url_ = url_.replace("{associatedProducts}", encodeURIComponent("" + associatedProducts));
  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processGetAssociatedUnAssociatedCategoryProducts(_response);
  });
}

function Category_processGetAssociatedUnAssociatedCategoryProducts(response: Response): Promise<MultifrontTypes.CategoryProductListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryProductListResponse);
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
 * Get associated Products with Category.
 * @param categoryId category id
 * @param associatedProducts Associated product status
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function Category_getAssociatedCategoryProducts(
  categoryId: number,
  associatedProducts: boolean,
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.CategoryProductListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "Category/GetAssociatedCategoryProducts/{categoryId}/{associatedProducts}";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (categoryId === undefined || categoryId === null) throw new Error("The parameter 'categoryId' must be defined.");
  url_ = url_.replace("{categoryId}", encodeURIComponent("" + categoryId));
  if (associatedProducts === undefined || associatedProducts === null) throw new Error("The parameter 'associatedProducts' must be defined.");
  url_ = url_.replace("{associatedProducts}", encodeURIComponent("" + associatedProducts));
  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processGetAssociatedCategoryProducts(_response);
  });
}

function Category_processGetAssociatedCategoryProducts(response: Response): Promise<MultifrontTypes.CategoryProductListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryProductListResponse);
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
 * Get the Categories associated to Product.
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function Category_getAssociatedCategoriesToProducts(
  productId: number,
  associatedProducts: boolean,
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.CategoryProductListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "Category/GetAssociatedCategoriesToProducts/{productId}/{associatedProducts}";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (productId === undefined || productId === null) throw new Error("The parameter 'productId' must be defined.");
  url_ = url_.replace("{productId}", encodeURIComponent("" + productId));
  if (associatedProducts === undefined || associatedProducts === null) throw new Error("The parameter 'associatedProducts' must be defined.");
  url_ = url_.replace("{associatedProducts}", encodeURIComponent("" + associatedProducts));
  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processGetAssociatedCategoriesToProducts(_response);
  });
}

function Category_processGetAssociatedCategoriesToProducts(response: Response): Promise<MultifrontTypes.CategoryProductListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.CategoryProductListResponse);
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
 * Method to publish category
 * @param body (optional) ID of category to be published.
 * @return OK
 */

export async function Category_publish(body: Models.ParameterModel | undefined): Promise<MultifrontTypes.PublishedResponse> {
  let url_ = baseUrl + "Category/Publish";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "POST",
    cache: "no-store",
    headers: await getHeaders("POST", String(baseUrl)),
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processPublish(_response);
  });
}

function Category_processPublish(response: Response): Promise<MultifrontTypes.PublishedResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.PublishedResponse);
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
 * Update product details associated to category.
 * @param body (optional) CategoryProductModel with product details
 * @return OK
 */

export async function Category_updateCategoryProductDetail(body: Models.CategoryProductModel | undefined): Promise<MultifrontTypes.TrueFalseResponse> {
  let url_ = baseUrl + "Category/UpdateCategoryProductDetail";

  url_ = url_.replace(/[?&]$/, "");

  const content_ = JSON.stringify(body);

  let options_: RequestInit = {
    body: content_,
    method: "PUT",
    headers: await getHeaders("PUT", String(baseUrl)),
    next: { revalidate: 0 },
  };

  return fetch(url_, options_).then((_response: Response) => {
    return Category_processUpdateCategoryProductDetail(_response);
  });
}

function Category_processUpdateCategoryProductDetail(response: Response): Promise<MultifrontTypes.TrueFalseResponse> {
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
 * Gets list of published categories, sub categories and products.
 * @param expand (optional)
 * @param filter (optional)
 * @param sort (optional)
 * @param pageIndex (optional)
 * @param pageSize (optional)
 * @return OK
 */

export async function WebStoreCategory_getCategoryDetails(
  expand: string[] | undefined,
  filter: FilterTuple[] | undefined,
  sort: { [key: string]: string } | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
): Promise<MultifrontTypes.WebStoreCategoryListResponse> {
  let options_: RequestInit = {
    method: "GET",
    cache: "no-store",
    headers: await getHeaders("GET", String(baseUrl)),
  };

  let url_ = baseUrl + "WebStoreCategory/GetCategoryDetails";

  url_ += buildEndpointQueryString({ expand, filter, sort, pageIndex, pageSize });

  if (expand === null) throw new Error("The parameter 'expand' cannot be null.");
  if (filter === null) throw new Error("The parameter 'filter' cannot be null.");
  if (sort === null) throw new Error("The parameter 'sort' cannot be null.");
  if (pageIndex === null) throw new Error("The parameter 'pageIndex' cannot be null.");
  if (pageSize === null) throw new Error("The parameter 'pageSize' cannot be null.");
  url_ = url_.replace(/[?&]$/, "");

  return fetch(url_, options_).then((_response: Response) => {
    return WebStoreCategory_processGetCategoryDetails(_response);
  });
}

function WebStoreCategory_processGetCategoryDetails(response: Response): Promise<MultifrontTypes.WebStoreCategoryListResponse> {
  const status = response.status;
  let _headers: any = {};
  if (response.headers && response.headers.forEach) {
    response.headers.forEach((v: any, k: any) => (_headers[k] = v));
  }
  if (status === 200) {
    return response.text().then((_responseText) => {
      let result200: any = null;
      result200 = _responseText === "" ? null : (JSON.parse(_responseText) as Models.WebStoreCategoryListResponse);
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

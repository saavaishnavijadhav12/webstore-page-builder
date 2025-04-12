import { IOrderDetailsProps, IOrderHistoryResponse, IOrderListRequest, IOrderListResponse } from "@znode/types/account";

import { objectToQueryString } from "@znode/utils/component";

export const getOrderType = async (params: IOrderListRequest): Promise<IOrderHistoryResponse> => {
  const { sortValue, pageIndex, pageSize, currentFilters = {}, orderType } = params;

  let queryString = Object.keys(sortValue).length > 0 ? `sortValue=${encodeURIComponent(JSON.stringify(sortValue))}` : "sortValue={}";

  queryString += `&orderType=${encodeURIComponent(orderType ?? "")}`;
  queryString += `&pageIndex=${pageIndex}`;
  queryString += `&pageSize=${pageSize}`;
  queryString += `&currentFilters=${encodeURIComponent(JSON.stringify(currentFilters))}`;
  const listData = await fetch(`/api/account/order/order-type?${queryString}`, { cache: "no-store" });
  const response: IOrderListResponse = await listData.json();

  return response.data;
};

export const getOrderTypeDetails = async (props: IOrderDetailsProps) => {
  const queryString: string = objectToQueryString(props);
  const orderDetails = await fetch(`/api/account/order/order-type-details?${queryString}`, {
    cache: "no-store",
  });
  const response = await orderDetails.json();
  return response;
};

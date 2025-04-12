import { AREA, errorStack, logServer } from "@znode/logger/server";
import { FilterCollection, FilterKeys, FilterOperators, convertCamelCase } from "@znode/utils/server";

import { IFilterTuple } from "@znode/types/filter";
import { IPortalDetail } from "@znode/types/portal";
import { IRMAReturnList } from "@znode/types/account";
import { RMAReturn_list } from "@znode/clients/v1";
import { convertDateTime } from "@znode/utils/component";
import { getGeneralSettingList } from "../../general-setting";
import { getSavedUserSession } from "@znode/utils/common";

export async function getReturnList(
  pageSize: number,
  pageIndex: number,
  sortValue: { [key: string]: string },
  searchByKey: [{ key: string; value: string; type: string; columns: { status: string; date: string } }],
  portalData: IPortalDetail
): Promise<IRMAReturnList> {
  try {
    const portalId = portalData.portalId;
    const session = await getSavedUserSession();
    const userId: number = session?.userId || 0;
    const filters: IFilterTuple[] = await getRMAReturnFilters(userId, portalId, searchByKey);

    const rmaList = await RMAReturn_list(undefined, filters, sortValue, pageIndex, pageSize);
    
    const returnOrderList = convertCamelCase(rmaList);
    const { totalResults } = returnOrderList || {};

    const generalSetting = await getGeneralSettingList();
    const { dateFormat, timeFormat, displayTimeZone } = generalSetting || {};
    
    const returnsData = returnOrderList?.returnList?.returns?.map(
      (returnOrder: { returnNumber: number; totalExpectedReturnQuantity: number; returnStatus: string; returnDate: string }) => {
        const { returnNumber, totalExpectedReturnQuantity, returnStatus, returnDate } = returnOrder;


        const formattedReturnDate = convertDateTime(returnDate, dateFormat, timeFormat, displayTimeZone);

        return {
          returnNumber,
          totalExpectedReturnQuantity,
          returnStatus,
          returnDate: formattedReturnDate,
        };
      }
    );

    return { totalResults, returnList: returnsData || [] };
  } catch (error) {
    logServer.error(AREA.RMA_RETURN, errorStack(error));
    return {
      totalResults: 0,
      returnList: [],
    };
  }
}

export async function getRMAReturnFilters(userId: number, portalId?: number, searchBy?: [{ key: string; value: string; type: string; columns: { status: string; date: string } }]) {
  const filters: FilterCollection = new FilterCollection();
  if (userId !== undefined && userId > 0) filters.add(FilterKeys.UserId, FilterOperators.Equals, userId.toString());
  if (portalId !== undefined && portalId > 0) filters.add(FilterKeys.PortalId, FilterOperators.Equals, portalId.toString());
  if (searchBy && searchBy.length > 0) {
    searchBy.forEach((val) => {
      filters.add(val?.type === "status" ? val?.columns?.status : val?.columns?.date, String(val?.key), String(val?.value));
    });
  }
  return filters.filterTupleArray;
}

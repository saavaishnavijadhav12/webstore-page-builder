import { AREA, errorStack, logServer } from "@znode/logger/server";
import { FilterCollection, FilterKeys, FilterOperators, convertCamelCase, generateTagName, getPortalHeader } from "@znode/utils/server";
import { FilterTuple, IClientCountry, IClientState, PortalCountry_getAssociatedCountryList, State_list } from "@znode/clients/v1";
import { ICountry, INewsLetter, INewsLetterResponse, IState } from "@znode/types/common";
import { mapCountryValues, mapStateValues } from "./mapper";

import { CACHE_KEYS } from "@znode/constants/cache-keys";
import { IFilterTuple } from "@znode/types/filter";
import { IGlobalAttributeValues } from "@znode/types/portal";
import { Users_signUpForNewsletter } from "@znode/clients/v2";
import { WebStoreMessages_webStoreMessagesGetByPortalId } from "@znode/clients/v2";

/**
 * Get associated country list based on portals.
 * @returns webStoreCountriesList.
 */
export async function getCountries(portalId: number): Promise<ICountry[] | []> {
  try {
    const portalData = await getPortalHeader();
    const filters = getUserFilters(portalId);
    const cacheInvalidator = new FilterCollection();
    cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}`, portalData.storeCode || ""));
    const webStoreCountriesList = await PortalCountry_getAssociatedCountryList(
      undefined,
      filters,
      undefined,
      undefined,
      undefined,
      cacheInvalidator.filterTupleArray as FilterTuple[]
    );
    if (webStoreCountriesList && webStoreCountriesList.Countries && webStoreCountriesList.Countries.length > 0) {
      webStoreCountriesList.Countries.length > 0 && webStoreCountriesList.Countries.sort((a, b) => (a.IsDefault === b.IsDefault ? 0 : a.IsDefault ? -1 : 1));
      return mapCountryValues(webStoreCountriesList.Countries as IClientCountry[]);
    }
    return [];
  } catch (error) {
    logServer.error(AREA.COUNTRY, errorStack(error));
    return [];
  }
}

/**
 * Get state list on the basis of country code.
 * @returns list of states.
 */
export async function getStateList(countryCode: string): Promise<IState[] | []> {
  try {
    const sort: { [key: string]: string } = {};
    sort["StateName"] = "ASC";
    const portalData = await getPortalHeader();
    const filters: FilterCollection = new FilterCollection();
    filters.add(FilterKeys.IsActive, FilterOperators.Equals, "true");
    if (countryCode) filters.add(FilterKeys.countryCode, FilterOperators.Is, String(countryCode));
    const cacheInvalidator = new FilterCollection();
    cacheInvalidator.add(FilterKeys.CacheTags, FilterOperators.Contains, generateTagName(`${CACHE_KEYS.PORTAL}`, portalData.storeCode || ""));
    const stateList = await State_list(undefined, filters.filterTupleArray, sort, undefined, undefined, cacheInvalidator.filterTupleArray as FilterTuple[]);
    return mapStateValues(stateList.States as IClientState[]);
  } catch (error) {
    logServer.error(AREA.STATE, errorStack(error));
    return [];
  }
}

export async function getAttributeValues(globalAttributes: IGlobalAttributeValues[], keys: string[]): Promise<Record<string, string> | null> {
  if (!Array.isArray(globalAttributes) || !Array.isArray(keys)) return null;
  const result: Record<string, string> = {};
  if (keys.length === 0) {
    return result;
  }
  keys.forEach((key) => {
    const attribute = globalAttributes.find((attr) => attr?.attributeCode?.toLowerCase() === key.toLowerCase());
    result[key] = attribute?.attributeValue?.toString() ?? "";
  });

  return result;
}

/**
 * Get filters for user.
 * @param portalId
 * @param localeId
 * @param catalogId
 * @returns filters.
 */
export function getUserFilters(
  portalId?: number,
  localeId?: number,
  userId?: number,
  IsActive?: number,
  znodeCatalogId?: number,
  giftCardId?: number,
  searchBy?: {
    key: string;
    value: string;
    type: string;
    columns: { status: string; date: string };
  }[],
  accountId?: number
): IFilterTuple[] {
  const filters: FilterCollection = new FilterCollection();

  if (portalId !== undefined && portalId > 0) filters.add(FilterKeys.PortalId, FilterOperators.Equals, String(portalId));
  if (localeId !== undefined && localeId > 0) filters.add(FilterKeys.LocaleId, FilterOperators.Equals, String(localeId));
  if (userId !== undefined && userId > 0) filters.add(FilterKeys.UserId, FilterOperators.Equals, String(userId));
  if (IsActive !== undefined) filters.add(FilterKeys.IsActive, FilterOperators.Equals, String(IsActive));
  if (znodeCatalogId !== undefined && znodeCatalogId > 0) filters.add(FilterKeys.ZnodeCatalogId, FilterOperators.Equals, String(znodeCatalogId));
  if (giftCardId !== undefined && giftCardId > 0) filters.add(FilterKeys.GiftCardId, FilterOperators.Equals, String(giftCardId));
  if (accountId !== undefined && accountId > 0) filters.add(FilterKeys.AccountId, FilterOperators.Equals, String(accountId));
  if (searchBy && searchBy.length > 0) {
    searchBy.forEach((val) => {
      filters.add(val?.type !== "Date" ? val?.columns?.status : val?.columns?.date, String(val?.key), val?.value);
    });
  }
  return filters.filterTupleArray;
}

/**
 * Sign Up For News Letter
 * @param INewsLetterResponse
 * @returns successResponse.
 */
export async function signUpForNewsLetter({ email }: INewsLetter): Promise<INewsLetterResponse> {
  try {
    if (email) {
      const successResponse = await Users_signUpForNewsletter({ Email: email });
      if (successResponse?.HasError)
        return {
          isSuccess: false,
          errorMessage: successResponse?.ErrorMessage,
        };
      return {
        isSuccess: successResponse.IsSuccess as boolean,
      };
    }
    return {
      isSuccess: false,
      errorMessage: "Email is required",
    };
  } catch (error) {
    logServer.error(AREA.NEWS_LETTER, errorStack(error));
    return {
      isSuccess: false,
      errorMessage: "An error occurred. Please try again later.",
    };
  }
}

/**
 * Validates a zip code based on the provided country code using regular expressions.
 * @param  The zip code to validate as a string.
 * @param countryCode The country code for which the zip code should be validated.
 * @returns `true` if the zip code is valid for the specified country code, otherwise `false`.
 */

export async function getContentMessage(key: string, portalId: number, localeId: number): Promise<string> {
  try {
    const { Messages } = await WebStoreMessages_webStoreMessagesGetByPortalId(portalId, localeId);
    const messageList = convertCamelCase(Messages);
    if (messageList) {
      const message = messageList.find(({ messageKey }: { messageKey: string }) => messageKey === key);
      return message ? message.message : "";
    }
    return "";
  } catch (error) {
    logServer.error(AREA.MESSAGE, errorStack(error));
    return "";
  }
}

import type { Data } from "@measured/puck";

export interface IExtendedData extends Data {
  isPageUnavailable?: boolean;
}
export interface IPageStructure {
  key: string;
  data: IExtendedData;
  headerData?: Data;
  footerData?: Data;
}

export type INullablePageStructure = IPageStructure | null;

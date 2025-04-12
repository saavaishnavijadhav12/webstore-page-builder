import type { Data } from "@measured/puck";
import { IPageStructure } from "@znode/types/visual-editor";
import { preparedContentItem } from "./prepared-content-item";
import { IPageVariant } from "./get-page";

const emptyData: Data = {
  content: [],
  root: {},
  zones: {},
};

interface IProcessContentParams {
  data: Data | undefined;
  id: string | null;
  searchParams: any;
  contentPageId?: number;
  pageVariant?: IPageVariant;
  dataId?:  string;
}

type IProcessHeaderFooterAndMainContentDataParams = {
  pageStructure: IPageStructure;
} & Omit<IProcessContentParams, "data">;

export async function processHeaderFooterAndMainContentData(params: IProcessHeaderFooterAndMainContentDataParams) {
  const { pageStructure, id, searchParams, contentPageId } = params;
  const [mainResult, headerResult, footerResult] = await Promise.all([
    processContent({
      data: pageStructure.data,
      id: id,
      searchParams: searchParams,
      contentPageId: contentPageId,
      "dataId":"mainLayout"
    }),
    processContent({
      data: pageStructure.headerData,
      id: id,
      searchParams: searchParams,
      contentPageId: contentPageId,
      pageVariant: "Layout",
       "dataId":"header"
    }),
    processContent({
      data: pageStructure.footerData,
      id: id,
      searchParams: searchParams,
      contentPageId: contentPageId,
      pageVariant: "Layout",
       "dataId":"footer"
    }),
  ]);
  return {
    headerData: headerResult,
    footerData: footerResult,
    mainData: mainResult,
  };
}

export async function processContent(params: IProcessContentParams): Promise<Data> {
  if (params?.data && typeof params?.data === "object" && Array.isArray(params?.data.content)) {
    const result = await preparedContentItem(params.data, params?.id, params?.searchParams, params?.contentPageId, params?.pageVariant);
    return result;
  }
  return emptyData;
}

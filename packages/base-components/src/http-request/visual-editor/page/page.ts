import { getPreviewPageByPageCode, getPageByPageCode } from "@znode/agents/visual-editor";

export const getPreviewPageDetails = async (props: { pageCode: string; portalCode: string }) => {
  const pageData = await getPreviewPageByPageCode(props.pageCode, props.portalCode, "All");
  return pageData;
};
export const getProductionPageDetails = async (props: { pageCode: string; portalCode: string }) => {
  const pageData = await getPageByPageCode(props.pageCode, props.portalCode, "All");
  return pageData;
};

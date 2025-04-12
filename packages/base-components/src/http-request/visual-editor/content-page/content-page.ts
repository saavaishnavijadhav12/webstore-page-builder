import { getPreviewContentPageByPageCode, getProductionContentPageByPageCode } from "@znode/agents/visual-editor";

export const getPreviewContentPageDetails = async (props: {contentPageCode: string, portalCode: string}) => {

  const pageData = await getPreviewContentPageByPageCode(props.contentPageCode, props.portalCode, "All");
  return pageData;
};

export const getProductionContentPageDetails = async (props: {contentPageCode: string, portalCode: string}) => {
  
  const pageData = await getProductionContentPageByPageCode(props.contentPageCode, props.portalCode, "All");
  return pageData;
};

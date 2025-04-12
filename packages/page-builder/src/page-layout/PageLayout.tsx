"use client";

import { type Data, Render } from "@measured/puck";
import "react-toastify/dist/ReactToastify.css";
import type { IConfigParam } from "../types/page-builder";
import { ReactNode, useMemo } from "react";
import { getConfig } from "../configs/get-layout-config";
import { PAGE_CONSTANTS } from "../constants/page-constant";
import { IPageStructure } from "@znode/types/visual-editor";
import { ToastContainer } from "react-toastify";

type PageEditorProps = {
  configParams: IConfigParam;
  children: ReactNode;
  pageStructure: IPageStructure;
};

export function PageLayout(props: Readonly<PageEditorProps>) {
  const { configParams, children, pageStructure } = props || {};
  const headerData: Data = pageStructure?.headerData || { content: [], zones: {}, root: {} };
  const footerData: Data = pageStructure?.footerData || { content: [], zones: {}, root: {} };
  console.log("called1111111");
  const [headerConfig, footerConfig] = useMemo(() => {
    return getConfig([{ ...configParams, configType: PAGE_CONSTANTS.URLS.HEADER }, { ...configParams, configType: PAGE_CONSTANTS.URLS.FOOTER }]);
  }, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} newestOnTop closeOnClick pauseOnHover />
      <Render data={headerData} config={headerConfig} />
      {children}
      <Render data={footerData} config={footerConfig} />
    </>
  );
}

"use client";

import React, { ReactNode } from "react";
import { PageRender } from "../page-render/PageRender";
import { PAGE_CONSTANTS } from "../constants/page-constant";
import { IPageEditorProps } from "./PageEditor";
import type { Data } from "@measured/puck";

type IPageEditorLayoutProps = Omit<IPageEditorProps, "onPublish"> & { children: ReactNode };
export function PageEditorLayout(props: Readonly<IPageEditorLayoutProps>) {
  const { configParams, pageStructure, children } = props || {};

  const headerData: Data = pageStructure?.headerData || { content: [], zones: {}, root: {} };
  const footerData: Data = pageStructure?.footerData || { content: [], zones: {}, root: {} };

  const isHeaderOrFooter = PAGE_CONSTANTS.ARRAYS.HEADER_FOOTER_PAGE_URL.includes(configParams.configType);

  const header = isHeaderOrFooter ? (
    <div style={{ height: "50px" }}></div>
  ) : (
    <PageRender data={headerData} configParam={{ ...configParams, configType: PAGE_CONSTANTS.URLS.HEADER }} />
  );

  const footer = !isHeaderOrFooter && <PageRender data={footerData} configParam={{ ...configParams, configType: PAGE_CONSTANTS.URLS.FOOTER }} />;

  return (
    <React.Fragment>
      {header}
      {children}
      {footer}
    </React.Fragment>
  );
}

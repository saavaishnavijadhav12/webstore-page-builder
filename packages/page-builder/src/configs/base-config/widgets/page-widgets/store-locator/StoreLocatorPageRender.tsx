"use client";

import { IStoreLocatorRenderProps } from "./StoreLocatorPageConfig";
import { StoreLocator } from "@znode/base-components/components/store-locator";
export function StoreLocatorPageRender(props: Readonly<IStoreLocatorRenderProps>) {
  return <StoreLocator />;
}

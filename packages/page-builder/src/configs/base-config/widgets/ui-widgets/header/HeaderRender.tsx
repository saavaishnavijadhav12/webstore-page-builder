import { DropZone } from "@measured/puck";
import type { IHeaderRenderProps } from "./HeaderConfig";
import { Header } from "@znode/base-components/components/layout-components/header/Header";
import React from "react";

export function HeaderRenderComponent(props: Readonly<IHeaderRenderProps & { hasDropZoneDisabled?: boolean }>) {
  if (!props.response) {
    return null;
  }

  const headerConfig = props.response.data?.headerConfig;
  const categories = props.response.data?.categories;
  const isUserLoggedIn = props.response.data?.isUserLoggedIn;
  const portalLocales = props.response.data?.portalLocales;
  const cartCount = props.response.data?.cartCount;
  const analyticsInfo = props.response.data?.analyticsInfo;
  console.log("HeaderRender:::::::::::::::::", HeaderRender);
  return (
    <Header
      configurations={headerConfig}
      categoryList={categories}
      userLoggedIn={isUserLoggedIn}
      portalLocales={portalLocales}
      analyticsInfo={analyticsInfo}
      cartCount={cartCount}
      elementTop={<DropZone zone="header-top" />}
      elementBottom={<DropZone zone="header-bottom" />}
      elementLinkPanel={
        <DropZone
          zone="header-link"
          style={{
            minHeight: "auto",
          }}
          allow={[""]}
        />
      }
      elementMobileLinkPanel={
        <DropZone
          zone="header-link"
          style={{
            minHeight: "auto",
          }}
          allow={[""]}
        />
      }
    />
  );
}

export const HeaderRender = React.memo(HeaderRenderComponent);

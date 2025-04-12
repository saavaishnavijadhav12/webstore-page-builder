"use client";

import "./header.scss";
import dynamic from "next/dynamic";

import React, { ReactNode, useEffect} from "react";

import { IAnalytics } from "@znode/types/common";
import { IHeaderConfig } from "@znode/types/headers";
import { IMegaMenuCategory } from "@znode/types/category";
import { IPortalLocale } from "@znode/types/portal";
import { Logo } from "./logo";
import { Navigation } from "./navigation/Navigation";
import { Search } from "./search";
import { TopMenu } from "./top-menu";
import { ScrollToTop } from "../../common/scroll-to-top";
import { useCategoryDetails, useProduct } from "@znode/base-components/stores";
import { useCommonDetails } from "packages/base-components/src/stores/common";
const ImpersonationBar = dynamic(() => import("../../impersonation").then((mod) => mod.ImpersonationBar), { ssr: false });
const MobileHeader = dynamic(() => import("./mobile-navigation/MobileHeader").then((mod) => mod.default), { ssr: false });

interface IHeaderProps {
  configurations: IHeaderConfig;
  categoryList: IMegaMenuCategory[];
  userLoggedIn: boolean;
  portalLocales: IPortalLocale[];
  analyticsInfo: IAnalytics;
  cartCount: number;
  elementTop: ReactNode;
  elementBottom: ReactNode;
  elementLinkPanel: ReactNode;
  elementMobileLinkPanel: ReactNode;
}

function HeaderComponent(props: Readonly<IHeaderProps>) {
  const { configurations, categoryList, userLoggedIn, portalLocales, analyticsInfo, cartCount } = props || {};
  const { setCategory, setUserLoggedIn, loading } = useCategoryDetails();
  const { setPortalLocale, setAnalyticsInfo } = useCommonDetails();
  const { updateCartCount } = useProduct();
  useEffect(() => {
    updateCartCount(cartCount);
    setUserLoggedIn(userLoggedIn);
    setPortalLocale(portalLocales);
    setAnalyticsInfo(analyticsInfo);
    categoryList && !loading && setCategory(categoryList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryList]);

  const isMobile = false;
  console.log("isMobile::::::::::::::::", isMobile);

  return (
    <>
      <ScrollToTop />
      <header className="sticky top-0 z-40 w-full mb-4 shadow-md bg-headerBgColor no-print">
        {props.elementTop}
        {userLoggedIn && <ImpersonationBar />}
        <div className="hidden desktop-header lg:block">
          <div className="flex items-center justify-between gap-3 px-4 py-6">
            <div className="pr-3" data-test-selector="divLogoImage" style={{
              width: "200px",
              height: "60px"
            }}>
              <Logo customClass="h-16 object-contain" imgSrc={configurations.logo.url} alternate="logo" width={200} height={60} dataTestSelector="imgDesktopLogo" />
            </div>

            <div className="relative flex items-center flex-1" data-test-selector="divSearchText">
              <div className="w-full">
                <Search barcode={configurations.search.barcode} voiceSearch={configurations.search.voiceBasedSearch} dataTestSelector="DesktopSearch" />
              </div>
            </div>

            <TopMenu configurations={configurations} />
          </div>
          <div className="flex items-center px-4 py-1 mt-1 navigation uppercase" data-test-selector="divLogoImage">
            <div className="flex items-center order-2 gap-4">
              <Navigation />
              {props.elementLinkPanel}
            </div>
          </div>
        </div>
        {isMobile && <div className="mobile-header lg:hidden no-print">
          <MobileHeader
            logoUrl={configurations.logo.url}
            barcode={configurations.search.barcode}
            voiceSearch={configurations.search.voiceBasedSearch}
            dataTestSelector="MobileSearch"
          >
            {props.elementMobileLinkPanel}
          </MobileHeader>
        </div>}
        {props.elementBottom}
      </header>
    </>
  );
}

export const Header = React.memo(HeaderComponent);


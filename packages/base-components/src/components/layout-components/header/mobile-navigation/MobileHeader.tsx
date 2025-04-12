"use client";

import "./mobile-navigation.scss";

import React, { useEffect, useState } from "react";
import { useProduct, useUser } from "../../../../stores";

import { ACCOUNT } from "@znode/constants/account";
import CartCount from "../../../cart/cart-count/CartCount";
import DropMenu from "../drop-menu/DropMenu";
import Link from "next/link";
import { Logo } from "../logo";
import MobileNavigation from "./MobileNavigation";
import { Search } from "../search";
import { ZIcons } from "../../../common/icons";
import { deleteCartCookies } from "@znode/agents/cart/cart-helper";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslationMessages } from "@znode/utils/component";

const MobileHeader = ({
  children,
  logoUrl,
  barcode,
  voiceSearch,
  dataTestSelector,
}: {
  children: React.ReactNode;
  logoUrl: string;
  barcode: boolean;
  voiceSearch: boolean;
  dataTestSelector?: string;
}) => {
  const commonTranslation = useTranslationMessages("Common");
  const router = useRouter();
  const { updateCartCount } = useProduct();
  const [isAdministrator, setIsAdministrator] = useState<boolean>(false);

  const { user, loadUser, isUserSessionLoading } = useUser();

  const [showNavBar, setShowNavBar] = useState(false);

  const displayMenu = () => {
    showNavBar === false ? setShowNavBar(true) : setShowNavBar(false);
  };

  const clearCartCookie = () => {
    deleteCartCookies();
    updateCartCount(0);
  };

  const logoutHandler = async (redirectToLogin = true) => {
    clearCartCookie();
    await signOut({ redirect: false });
    // loadUser(true);
    redirectToLogin ? router.push("/login") : router.push("/");
  };

  useEffect(() => {
    if (!isUserSessionLoading && user) {
      setIsAdministrator((user && user.roleName?.toLowerCase() === ACCOUNT.ADMINISTRATOR_ROLE_NAME.toLocaleLowerCase()) || false);
    }
  }, [isUserSessionLoading, user]);

  useEffect(() => {
    loadUser(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center flex-1 pr-[0.9rem]" data-test-selector="divLogoImage">
        <div className="order-1 mx-0 py-2 pl-[0.8rem]" data-test-selector="divLogoImage">
          <Logo customClass="h-16 object-contain" imgSrc={logoUrl} alternate="logo" width={200} height={60} dataTestSelector="imgMobileLogo" />
        </div>
        <div className="flex items-center justify-end flex-1 order-2">
          <Link href={"/order-status"} className="text-sm font-medium" data-test-selector="linkOrderStatus">
            {commonTranslation("trackOrder")}
          </Link>

          <div className="order-2 pl-5 text-textColor1">
            {user ? (
              <DropMenu onLogout={logoutHandler} isAdminUser={isAdministrator} mobileView={true} />
            ) : (
              <Link href="/login" data-test-selector="linkMobileSignIn" aria-label="User Login" prefetch={false}>
                <ZIcons name="circle-user" height={"27px"} width={"27px"} strokeWidth={"1.5px"} data-test-selector="svgMobileSignIn" />
              </Link>
            )}
          </div>
          <div className="order-3">
            <CartCount dataTestSelector={"Mobile"} />
          </div>
          <div className="order-4 pl-5">
            <div className="menu-toggle">
              <div onClick={() => displayMenu()} data-test-selector="linkMainMenu">
                <ZIcons name="menu" width={"25px"} height={"25px"} strokeWidth={"1.5px"} data-test-selector="svgMainMenu" />
              </div>
              {showNavBar && (
                <div className="fixed top-0 z-10 overflow-auto mobile-menu-container scroll-smooth max-h-max border-red-50">
                  <MobileNavigation setShowNavBar={setShowNavBar} linkPanelData={children} portalLocales={[]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-1 p-3 duration-300 ease-in">
        <div className="w-full">
          <Search barcode={barcode} voiceSearch={voiceSearch} dataTestSelector={dataTestSelector} />
        </div>
      </div>
    </>
  );
};

export default MobileHeader;

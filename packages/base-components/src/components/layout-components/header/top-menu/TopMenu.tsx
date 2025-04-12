"use client";
import dynamic from "next/dynamic";
import { setLocalStorageData, useTranslationMessages } from "@znode/utils/component";
import { useEffect, useRef, useState } from "react";
import { useProduct, useUser } from "../../../../stores";
import { ACCOUNT } from "@znode/constants/account";
import { APP } from "@znode/constants/app";
import { IHeaderConfig } from "@znode/types/headers";
import { IUserSession } from "@znode/types/user";
import IdleTimeout from "../../../timeout/Timeout";
import { NavLink } from "../../../common/nav-link";
import { deleteCartCookies } from "@znode/agents/cart/cart-helper";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
const DropMenu = dynamic(() => import("../drop-menu/DropMenu").then((mod) => mod.default), { ssr: false });
const DynamicFormTemplate = dynamic(() => import("../../../common/dynamic-form-template").then((mod) => mod.DynamicFormTemplate), { ssr: false });



import { ChangeLocale } from "../change-locale/ChangeLocale";
import CartCount from "../../../cart/cart-count/CartCount";

export function TopMenu(props: { configurations: IHeaderConfig }) {
  const { configurations } = props || {};
  const { links, changeLocale } = configurations;
  const loginTranslations = useTranslationMessages("Login");
  const menuTranslations = useTranslationMessages("Menu");
  const commonTranslations = useTranslationMessages("Common");

  const { status } = useSession();
  const { user, loadUser, isUserSessionLoading } = useUser();
  const [userDetails, setUserDetails] = useState<IUserSession | undefined>();

  const [openQuickOrderForm, setOpenQuickOrderForm] = useState(false);
  const { updateCartCount } = useProduct();
  const quickOrderIconRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const clearCartCookie = () => {
    deleteCartCookies();
    updateCartCount(0);
  };

  const logoutHandler = async (redirectToLogin = true) => {
    clearCartCookie();
    await signOut({ redirect: false });
    setLocalStorageData("compareProductList", JSON.stringify([]));
    redirectToLogin
      ? (window.location.href = "/login")
      : (window.location.href = "/");
  };

  const handleTimeout = async () => {
    if (user && status === "authenticated") {
      await logoutHandler(true);
    }
  };

  const quickOrderClickHandler = (e: MouseEvent) => {
    if (
      quickOrderIconRef &&
      quickOrderIconRef.current &&
      quickOrderIconRef.current.contains(e.target as Node)
    ) {
      if (!openQuickOrderForm) setOpenQuickOrderForm(() => true);
    } else {
      setOpenQuickOrderForm(() => false);
    }
  };

  useEffect(() => {
    loadUser(true);
    if (typeof window !== "undefined") {
      window.addEventListener("click", quickOrderClickHandler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", quickOrderClickHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !isUserSessionLoading && user && setUserDetails(user);
  }, [isUserSessionLoading, user]);

  return (
    <div className="flex flex-col items-start my-0 text-sm lg:flex-row lg:justify-between lg:items-center lg:mt-2 lg:mb-2 min-w-[510px] min-h-[18px]">
        <IdleTimeout timeout={APP.SESSION_TIMEOUT} onTimeout={handleTimeout} />

        {/* Quick Order */}
        <div
          className="relative flex items-center justify-center"
          ref={quickOrderIconRef}
        >
          <div
            className="px-4 font-semibold border-r-2 border-black cursor-pointer"
            data-test-selector="linkQuickOrder"
          >
            {menuTranslations("quickOrder")}
          </div>

          {/* Dropdown always in DOM, only toggling visibility */}
          <div
            className={`absolute z-20 bg-white border border-gray-200 shadow-md top-10 rounded-cardBorderRadius w-80 transition-all duration-200 ${
              openQuickOrderForm
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {/* Arrow */}
            <div className="relative flex items-center justify-center">
              <div className="absolute z-0 w-4 h-4 ml-4 rotate-45 bg-white border border-gray-200 -top-2"></div>
            </div>
            {/* Dropdown content */}
            {openQuickOrderForm && <div className="relative z-20 w-full p-2 bg-white">
              <DynamicFormTemplate
                defaultRowCount={1}
                buttonText={menuTranslations("addToCart")}
                showAddNewField={false}
                showClearAllButton={false}
                buttonPosition="bottom"
                showFieldClearButton={false}
                onButtonSubmit={() => setOpenQuickOrderForm(false)}
                showHeading={false}
                showMultipleItemsButton={true}
                showFullWidthResult={true}
              />
            </div>}
          </div>
        </div>

        {/* Track Order */}
        <NavLink
          url={"/order-status"}
          className="px-4 font-semibold border-r-2 border-black"
          dataTestSelector="linkOrderStatus"
        >
          {commonTranslations("trackOrder")}
        </NavLink>

        {/* Locale Switcher */}
        {changeLocale.enable && (
          <div className="px-4 border-r-2 border-black">
            <ChangeLocale />
          </div>
        )}

        {/* Auth Dropdown or Placeholder */}
        <div className="hidden lg:flex">
          <div className="px-5 font-semibold border-r-2 border-black xs:hidden lg:flex min-w-[100px]" data-test-selector="divSignIn">
            {userDetails ? (
              <DropMenu
                name={userDetails.firstName || ""}
                onLogout={logoutHandler}
                isAdminUser={
                  (user &&
                    user.roleName?.toLowerCase() ===
                      ACCOUNT.ADMINISTRATOR_ROLE_NAME.toLowerCase()) ||
                  false
                }
              />
            ) : (
              links.signIn.enable && (
                <NavLink
                  url={`/login${pathname ? "?returnUrl=" + pathname : ""}`}
                  className="font-semibold"
                  dataTestSelector="linkSignIn"
                >
                  {loginTranslations("signIn")}
                </NavLink>
              )
            )}
          </div>
        </div>

        {/* Cart Count */}
        <div className="relative text-black min-w-[60px]" title="Cart">
          <CartCount dataTestSelector={"Desktop"} />
        </div>
      </div>
  );
}
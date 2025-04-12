"use client";

import { deleteCookie, getCookie, useTranslationMessages } from "@znode/utils/component";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { COMMON } from "@znode/constants/common";
import { IUser } from "@znode/types/user";
import { useUser } from "../../../stores/user-store";
import { deleteCartCookies } from "@znode/agents/cart/cart-helper";
import { useProduct } from "../../../stores";
import Button from "../../common/button/Button";

export function ImpersonationBar() {
  const { status } = useSession();
  const [proxyAdminName, setProxyAdminName] = useState<IUser | undefined>();
  const [loading, setLoading] = useState(false);
  const impersonation = useTranslationMessages("Impersonation");
  const { loadUser, user } = useUser();
  const { updateCartCount } = useProduct();

  const crsName = getCookie(COMMON.CRS_USERNAME);

  useEffect(() => {
    if (status === "authenticated" && user && user.crsName) {
      setProxyAdminName(user as IUser);
    } else if (status === "unauthenticated") {
      setProxyAdminName(undefined);
    }
  }, [user, status]);

  const showUserInfo = (userDetails?: IUser) => {
    let userName = "";
    userName = userDetails?.crsName
      ? `${userDetails.crsName} ${impersonation("loggedInAs") || ""} ${userDetails.firstName || ""} ${userDetails.lastName || ""}`
      : crsName
      ? `${crsName} ${impersonation("loggedInAs") || ""} ${user?.firstName || ""} ${user?.lastName || ""}`
      : "";

    return userName.trim() || "";
  };

  const clearCartCookie = () => {
    deleteCartCookies();
    updateCartCount(0);
  };

  const logoutHandler = async () => {
    setLoading(true);
    deleteCookie(COMMON.MAPPING_ID);
    deleteCookie(COMMON.CRS_USERNAME);
    clearCartCookie();
    await signOut({ redirect: false });
    window.location.href = "/login";
    loadUser(true);
  };

  if (!proxyAdminName && !crsName) {
    // Return null or an empty string if no data is available
    return ""; // Or return null, depending on your needs
  }

  return (
    <div className="flex justify-center p-2 bg-black border-b text-white gap-2 items-center">
      <div>{proxyAdminName ? showUserInfo(proxyAdminName) : crsName}</div>
      <Button
        type="secondary"
        size="small"
        className="hover:bg-primaryBtnTextColor hover:text-secondaryBtnTextColor"
        loading={loading}
        dataTestSelector="btnLogoutImpersonation"
        onClick={logoutHandler}
        loaderHeight="20px"
        loaderWidth="20px"
      >
        {impersonation("logout")}
      </Button>
    </div>
  );
}

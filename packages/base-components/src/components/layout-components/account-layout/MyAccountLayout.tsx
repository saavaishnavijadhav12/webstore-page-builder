"use client";

import { getCustomPath, useTranslationMessages } from "@znode/utils/component";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { AccountNavigation } from "../../account/navigation/AccountNavigation";
import { ClientBreadCrumbs } from "../../common/breadcrumb";
import { IClientBreadCrumbsData } from "@znode/types/breadcrumb";
import { IUser } from "@znode/types/user";
import { useUser } from "../../../stores/user-store";

export function MyAccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const accountTranslations = useTranslationMessages("Breadcrumb");
  const [userDetails, setUserDetails] = useState<IUser>();
  //TODO : const restrictedRoutes: string[] = ["change-password", "forgot-password", "ResetPassword", "ValidateImpersonationSession"];
  const searchParams = useSearchParams();
  const nextUrl = usePathname() || "";
  const { user, isUserSessionLoading } = useUser();

  useEffect(() => {
    !isUserSessionLoading && user && setUserDetails(user);
  }, [isUserSessionLoading, user]);

  const getTranslatedCustomPath = (breadCrumbsData: IClientBreadCrumbsData) => {
    return {
      title: accountTranslations(breadCrumbsData.title || "account"),
      routingLabel: accountTranslations(breadCrumbsData.routingLabel),
      routingPath: breadCrumbsData.routingPath,
      nestedRouting: breadCrumbsData.nestedRouting,
      nestedRoutingPath: breadCrumbsData.nestedRoutingPath,
      nestedRoutingTitle: breadCrumbsData.nestedRoutingTitle ? accountTranslations(breadCrumbsData.nestedRoutingTitle) : "",
      nestedRoutingLabel: accountTranslations(breadCrumbsData.nestedRoutingLabel || "accountsLabel"),
    };
  };

  const breadCrumbsData: IClientBreadCrumbsData = getCustomPath(searchParams, nextUrl);
  const translatedCustomPath: IClientBreadCrumbsData = getTranslatedCustomPath(breadCrumbsData);
  return (
    <main className="w-full mb-4 print-style">
      <div>
        <div className="no-print">
          <ClientBreadCrumbs customPath={translatedCustomPath} />
        </div>
        <div className="md:flex">
          {userDetails && (
            <div className="w-full sm:w-full md:w-56 no-print md:mr-5" data-test-selector="divMyAccountContainer">
              <AccountNavigation></AccountNavigation>
            </div>
          )}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </main>
  );
}

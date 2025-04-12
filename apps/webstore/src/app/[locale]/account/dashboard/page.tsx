import { Dashboard } from "@znode/base-components/account/dashboard";
import { NextIntlClientProvider } from "next-intl";
import { fetchMessages, getPortalHeader } from "@znode/utils/server";
import { getSavedUserSession } from "@znode/utils/common";
import { getDashBoard } from "@znode/agents/account";
import { IUser } from "@znode/types/user";
import { IAddress } from "@znode/types/address";

interface IDashBoardDetails {
  dashboardBillingAddress: IAddress;
  dashboardShippingAddress: IAddress;
}

export default async function DashboardPage() {
  const messages = await fetchMessages(["Dashboard", "OrderHistory", "WishList", "Common", "Payment"]);
  const userData = await getSavedUserSession();
  const userId = Number(userData?.userId || 0);
  const portalData = await getPortalHeader();
  const dashBoardDetails  = await getDashBoard(Number(userId), portalData.portalId, Boolean(true)) as IDashBoardDetails;
  const { dashboardShippingAddress, dashboardBillingAddress } = dashBoardDetails || {dashboardBillingAddress: {}, dashboardShippingAddress: {} } as IAddress;
  return (
    <NextIntlClientProvider messages={{ ...messages }}>
      <Dashboard shippingAddress={dashboardShippingAddress} billingAddress={dashboardBillingAddress} userData={userData as IUser} />
    </NextIntlClientProvider>
  );
}

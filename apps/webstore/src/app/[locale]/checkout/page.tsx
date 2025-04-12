import { fetchMessages, getPortalHeader } from "@znode/utils/server";

import { BreadCrumbs } from "@znode/base-components/common/breadcrumb";
import { Checkout } from "@znode/base-components/checkout/Checkout";
import { IUser } from "@znode/types/user";
import { NextIntlClientProvider } from "next-intl";
import { getCheckoutRequiredUserDetails } from "@znode/agents/checkout";
import { getPaymentConfigurations } from "@znode/agents/payment";
import { getSavedUserSession } from "@znode/utils/common";
import { getCartPageSettings } from "@znode/agents/cart";
import { ICartSettings } from "@znode/types/cart";
import { getGeneralSettingList } from "@znode/agents/general-setting";

export default async function CartIndexPage() {
  const messages = await fetchMessages(["Checkout", "Common", "Discount", "Address", "Promotions", "Payment", "Register", "SignUp", "BehaviorMsg", "Orders"]);
  const portalHeader = await getPortalHeader();
  const checkoutPortalData = await getCartPageSettings();
  const generalSetting = await getGeneralSettingList();
  const userDetails = (await getSavedUserSession()) ?? {};

  const { enableShippingAddressSuggestion, approvalType, enableApprovalRouting, orderLimit, recaptchaDetails } = await getCheckoutRequiredUserDetails();
  const paymentOptions = await getPaymentConfigurations(portalHeader.portalId);
  const BreadCrumbsData = {
    title: "Checkout",
    routingLabel: "Home",
    routingPath: "/",
  };

  return (
    <>
      <BreadCrumbs customPath={BreadCrumbsData} />
      <NextIntlClientProvider messages={{ ...messages }}>
        <Checkout
          paymentOptions={paymentOptions}
          enableShippingAddressSuggestion={enableShippingAddressSuggestion}
          approvalType={approvalType}
          orderLimit={orderLimit}
          enableApprovalRouting={enableApprovalRouting}
          recaptchaDetails={recaptchaDetails}
          loginToSeePriceAndInventory={checkoutPortalData?.loginToSeePricingAndInventory}
          userDetails={userDetails as IUser}
          checkoutPortalData={checkoutPortalData as ICartSettings}
          generalSetting={generalSetting}
        />
      </NextIntlClientProvider>
    </>
  );
}

import { BreadCrumbs } from "@znode/base-components/common/breadcrumb";
import { CART_COOKIE } from "@znode/constants/cookie";
import { Cart } from "@znode/base-components/cart/Cart";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { fetchMessages } from "@znode/utils/server";
import { removeShippingByClassNumber } from "@znode/agents/checkout";
import { getSavedUserSession } from "@znode/utils/common";
import { getCartNumber, getCartPageSettings } from "@znode/agents/cart";
import { IUser } from "@znode/types/user";

async function removeSelectedShippingOption(user: IUser | null) {
  const cookieStore = cookies();
  let cartNumber = cookieStore.get(CART_COOKIE.CART_NUMBER)?.value;
  if (!cartNumber) {
    const userId: number = user?.userId ?? 0;
    if (userId) {
      cartNumber = (await getCartNumber(userId)) || "";
    }
  }

  if (cartNumber) await removeShippingByClassNumber(cartNumber);
}

export default async function CartIndexPage() {
  const user = await getSavedUserSession();
  await removeSelectedShippingOption(user);
  const cartPagePortalDetails = await getCartPageSettings();
  const messages = await fetchMessages(["Checkout", "Discount", "Cart", "BehaviorMsg", "Promotions", "SavedCart", "Common", "Cart"]);

  const BreadCrumbsData = {
    title: "Cart",
    routingLabel: "Home",
    routingPath: "/",
  };

  return (
    <>
      <BreadCrumbs customPath={BreadCrumbsData} />
      <NextIntlClientProvider messages={{ ...messages }}>
        <Cart cartRequiredSettings={cartPagePortalDetails} userDetails={user} />
      </NextIntlClientProvider>
      {/* TODO:*/}
      {/* <Wrapper widgetKey="1789" widgetCode="CartPageAdSpace" typeOfMapping="PortalMapping" displayName="CONTAINER WIDGET" cMSMappingId={portalId || 0} /> */}
    </>
  );
}

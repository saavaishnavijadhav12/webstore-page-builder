import { NextIntlClientProvider } from "next-intl";
import { fetchMessages } from "@znode/utils/server";
import { OrderHistory } from "@znode/base-components/account/order";

export default async function OrderListPage() {
  const messages = await fetchMessages(["OrderHistory", "Common", "Pagination", "Payment", "Promotions", "Discount", "BehaviorMsg", "Orders"]);

  return (
    <NextIntlClientProvider locale="en" messages={{ ...messages }}>
      <OrderHistory />
    </NextIntlClientProvider>
  );
}

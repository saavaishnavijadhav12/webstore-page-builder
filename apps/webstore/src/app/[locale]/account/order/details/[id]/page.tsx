import { NextIntlClientProvider } from "next-intl";

import { fetchMessages } from "@znode/utils/server";
import { redirect } from "next/navigation";
import { OrderReceipt } from "@znode/base-components/account/order-receipt";

export default async function OrderDetailPage({ params }: Readonly<{ params: { id: number } }>) {
  const messages = await fetchMessages(["Common", "Orders", "Payment", "MyAccount"]);
  if (params.id) {
    return (
      <NextIntlClientProvider locale="en" messages={{ ...messages }}>
        <OrderReceipt orderId={params?.id} isReceipt={false} />
      </NextIntlClientProvider>
    );
  }
  return redirect("/404");
}

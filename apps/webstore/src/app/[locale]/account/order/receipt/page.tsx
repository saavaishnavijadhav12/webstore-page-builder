import { NextIntlClientProvider } from "next-intl";
import { getResourceMessages } from "@znode/utils/server";
import { OrderReceipt } from "@znode/base-components/account/order-receipt";

export default async function OrderReceiptPage({ params }: Readonly<{ params: { id: number } }>) {
  const commonTranslation = await getResourceMessages("Common");
  const orderTranslation = await getResourceMessages("Orders");
  const paymentMessages = await getResourceMessages("Payment");

  return (
    <NextIntlClientProvider locale="en" messages={{ ...commonTranslation, ...orderTranslation, ...paymentMessages }}>
      <OrderReceipt orderId={params?.id} isReceipt={true} />
    </NextIntlClientProvider>
  );
}

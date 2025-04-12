import { PendingOrderReceipt } from "@znode/base-components/account/pending-order";
import { NextIntlClientProvider } from "next-intl";
import { fetchMessages } from "@znode/utils/server";

export default async function PendingOrderReceiptPage({ params }: Readonly<{ params: { id: string } }>) {
  const messages = await fetchMessages(["ApprovalRouting", "Common", "Pagination", "Orders"]);

  return (
    <NextIntlClientProvider messages={{ ...messages }}>
      <PendingOrderReceipt orderNumber={params?.id} isPendingPayment={false} receiptModule={false} />
    </NextIntlClientProvider>
  );
}

import { NextIntlClientProvider } from "next-intl";
import { QuoteOrderDetails } from "@znode/base-components/account/quote/QuoteOrderDetails";
import { fetchMessages } from "@znode/utils/server";

export default async function QuoteOrder({ params }: { params: { id: string } }) {
  const localeMessages = ["Quote", "Common", "Checkout", "Payment", "Orders"];
  const messages = await fetchMessages(localeMessages);

  return (
    <NextIntlClientProvider messages={{ ...messages }}>
      <QuoteOrderDetails quoteNumber={params?.id || ""} />
    </NextIntlClientProvider>
  );
}

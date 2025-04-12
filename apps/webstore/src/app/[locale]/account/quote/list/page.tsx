import { NextIntlClientProvider } from "next-intl";
import { getResourceMessages } from "@znode/utils/server";
import { QuoteOrderList } from "@znode/base-components/account/quote";

export default async function QuoteOrderListPage() {
  const commonMessages = await getResourceMessages("Common");
  const paginationMessages = await getResourceMessages("Pagination");
  const accountQuote = await getResourceMessages("Quote");
  return (
    <NextIntlClientProvider messages={{ ...commonMessages, ...accountQuote, ...paginationMessages }}>
      <QuoteOrderList />
    </NextIntlClientProvider>
  );
}

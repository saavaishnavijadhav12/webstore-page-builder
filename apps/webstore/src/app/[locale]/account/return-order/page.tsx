import { NextIntlClientProvider } from "next-intl";
import { getResourceMessages } from "@znode/utils/server";
import { ReturnOrder } from "@znode/base-components/account/return-order";

export default async function ReturnOrderPage() {
  const returnOrderMessages = await getResourceMessages("ReturnOrder");
  const commonMessages = await getResourceMessages("Common");
  const paginationMessages = await getResourceMessages("Pagination");
  return (
    <NextIntlClientProvider locale="en" messages={{ ...returnOrderMessages, ...commonMessages, ...paginationMessages }}>
      <ReturnOrder />
    </NextIntlClientProvider>
  );
}

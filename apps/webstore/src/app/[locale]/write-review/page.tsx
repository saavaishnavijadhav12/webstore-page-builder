import { NextIntlClientProvider } from "next-intl";
import { WriteReview } from "@znode/base-components/components/write-review/WriteReview";
import { getResourceMessages } from "@znode/utils/server";

export default async function WriteReviewPage() {
  const reviewMessages = await getResourceMessages("Review");
  const commonMessages = await getResourceMessages("Common");
  return (
    <NextIntlClientProvider messages={{ ...reviewMessages, ...commonMessages }}>
      <WriteReview />
    </NextIntlClientProvider>
  );
}
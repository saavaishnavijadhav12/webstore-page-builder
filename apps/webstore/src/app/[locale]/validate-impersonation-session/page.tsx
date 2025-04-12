import { NextIntlClientProvider } from "next-intl";
import { checkExistingUserSession } from "@znode/agents/impersonation";
import { getPortalDetails } from "@znode/agents/portal";
import { getResourceMessages } from "@znode/utils/server";
import { ImpersonationLogin } from "@znode/base-components/components/impersonation";

interface ISearchParams {
  token: string;
}

export default async function impersonateUser({ searchParams }: { searchParams: ISearchParams }) {
  const { token } = searchParams;
  const encodedToken = encodeURIComponent(token);

  const portalData = await getPortalDetails();
  const isUserLoggedIn = await checkExistingUserSession(encodedToken || "", portalData.storeCode || "");
  const enableCartRedirection = portalData?.portalFeatureValues?.persistentCart || false;
  const portalId= portalData.portalId || 0;

  const loginMessages = await getResourceMessages("Impersonation");
  return (
    <NextIntlClientProvider messages={{ ...loginMessages }}>
      <ImpersonationLogin token={encodedToken} portalId= {portalId} enableCartRedirection={enableCartRedirection} isUserLoggedIn={isUserLoggedIn} />
    </NextIntlClientProvider>
  );
}

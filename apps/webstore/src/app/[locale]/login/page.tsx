import { fetchMessages } from "@znode/utils/server";
import { ISearchParams } from "@znode/types/search-params";
import { Login } from "@znode/base-components/components/login";
import { NextIntlClientProvider } from "next-intl";
import { getLoginSettings } from "@znode/agents/login";
export default async function LoginPage({ searchParams }: { searchParams?: ISearchParams }) {
  const messages = await fetchMessages(["Login", "SignUp", "Common", "ToolTip", "CartIcon"]);
  const { storeCode, loginRequired, redirectURL, enableCartRedirection, recaptchaDetails } = await getLoginSettings();
  return (
    <NextIntlClientProvider messages={{ ...messages }}>
      <Login
        storeCode={storeCode as string}
        returnUrl={searchParams?.returnUrl || ""}
        isLoginRequired={loginRequired}
        enableCartRedirection={enableCartRedirection ?? false}
        redirectURL={redirectURL || searchParams?.returnUrl || ""}
        recaptchaDetails={recaptchaDetails}
      />
    </NextIntlClientProvider>
  );
}

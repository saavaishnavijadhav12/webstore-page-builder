import "@znode/base-components/tailwind-config/global.css";

import { AnalyticsManager } from "@znode/base-components/components/analytics-manager/AnalyticsManager";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import SessionLayout from "./SessionLayout";
import { fetchMessages, getPortalHeader } from "@znode/utils/server";
import { getMetaData, getSchemaDetails } from "@znode/agents/portal";
import { PageLayout } from "@znode/page-builder/page-layout";
import { IPageStructure } from "@znode/types/visual-editor";
import { getPage } from "@znode/page-builder/utils/get-page";
import { headers } from "next/headers";
import { getUrl } from "@znode/utils/common";
import { localBusinessSchema, organizationSchema, websiteSchema } from "packages/utils/src/component/schema-helper";
import { JsonLd } from "@znode/base-components/common/schema";
import TrackingPixel from "@znode/base-components/components/tracking-pixel/TrackingPixel";

export async function generateMetadata(): Promise<Metadata> {
  const portalData = await getMetaData();
  const headersList = headers();
  const canonicalUrl = getUrl(headersList);
  const details = portalData;
  return {
    title: details?.websiteTitle,
    description: details?.websiteDescription,
    icons: {
      icon: `${details?.mediaServerUrl}${details?.faviconImage}`,
    },
    robots: details?.defaultRobotTag,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const currentUrl = getUrl(headersList);
  const messages = await fetchMessages([
    "Barcode",
    "Common",
    "Layout",
    "DropDown",
    "Menu",
    "Impersonation",
    "Search",
    "VoiceSearch",
    "Login",
    "ChangeLocale",
    "DynamicFormTemplate",
    "CartIcon"
  ]);

  const themeName = (await getPortalHeader()).themeName || (process.env.DEFAULT_THEME as string);
  const schemaDetails = await getSchemaDetails();
  const organization = organizationSchema(schemaDetails, currentUrl);
  const website = websiteSchema(currentUrl);
  const business = localBusinessSchema(schemaDetails, currentUrl);
  const themeData = await getPortalHeader(undefined, "themeData");

  const theme = {
    "data-theme": themeName.toLocaleLowerCase(),
  };

  const pageStructure: IPageStructure = await getPage({
    url: "layout", // !! layout only
    theme: themeName,
    pageVariant: "Layout",
  });

  return (
    <html lang="en" {...theme}>
      <head>
        <style>{String(themeData)}</style>
      </head>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider
          messages={{
            ...messages,
          }}
        >
          <SessionLayout>
            <PageLayout
              configParams={{
                configType: "",
                theme: themeName || "",
              }}
              pageStructure={pageStructure}
            >
              <div className="flex-1 pl-4 pr-4" aria-label="pageEditor">
                {children}
                {process.env.NODE_ENV === "production" && <AnalyticsManager />}
                <JsonLd jsonLdData={organization} />
                <JsonLd jsonLdData={website} />
                <JsonLd jsonLdData={business} />
              </div>

              {process.env.NODE_ENV === "production"  && <TrackingPixel />}
            </PageLayout>
          </SessionLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

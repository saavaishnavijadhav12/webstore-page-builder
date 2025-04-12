import React from "react";
import Client from "../../client";
import { getPage } from "@znode/page-builder/utils/get-page";
import { ISearchParams } from "@znode/types/search-params";

import { fetchMessages, getPortalHeader } from "@znode/utils/server";
import { NextIntlClientProvider } from "next-intl";
import { NotFound } from "@znode/base-components/components/not-found";
import { IPageStructure } from "@znode/types/visual-editor";

const localeMessages = ["Common"];

export default async function BrandListPage({ searchParams }: Readonly<{ params: { id: number }; searchParams: ISearchParams }>) {
  const themeName = (await getPortalHeader()).themeName || process.env.DEFAULT_THEME;

  const url = "brand/list";
  const pageStructure: IPageStructure = await getPage({
    url,
    searchParams: searchParams,
    theme: themeName as string,
  });

  if (!pageStructure.data.content.length) {
    return <NotFound />;
  }

  const messages = await fetchMessages(localeMessages);
  return (
    <NextIntlClientProvider
      locale="en"
      messages={{
        ...messages,
      }}
    >
      <Client data={pageStructure.data} themeName={themeName || ""} configType="brand-list" />
    </NextIntlClientProvider>
  );
}

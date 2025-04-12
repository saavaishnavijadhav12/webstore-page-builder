import { fetchMessages, getPortalHeader } from "@znode/utils/server";

import Client from "../../client";
import { ISearchParams } from "@znode/types/search-params";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { NotFound } from "@znode/base-components/components/not-found";
import { SEO_TYPES } from "@znode/constants/seo-types";
import { getSeoData } from "@znode/agents/robot-tag/robot-tag";
import { WishlistMarker } from "@znode/base-components/common/wishlist-marker";
import { getPageStructure } from "@znode/page-builder/utils/get-page-structure";

export async function generateMetadata({ params }: { params: { id: number } }): Promise<Metadata | null> {
  const seoDetails = await getSeoData(undefined, params.id, SEO_TYPES.CATEGORY);
  return seoDetails;
}

const localeMessages = ["Product", "Common", "Facet", "Pagination", "FacetChipList", "Addon", "Price", "WishList", "Inventory", "WishList"];
export default async function CategoryPage({ params, searchParams }: Readonly<{ params: { id: number }; searchParams: ISearchParams }>) {
  const url = "category/" + params.id;

  const themeName = (await getPortalHeader()).themeName || (process.env.DEFAULT_THEME as string);
  let configType = "category";
  const { pageStructure, isNotFound, viewCustom404, updatedConfigType } = await getPageStructure(
    url,
    searchParams,
    themeName, // theme1, theme2
    configType
  );
  configType = updatedConfigType;
  if (isNotFound) return <NotFound viewCustom404={viewCustom404} />;

  const messages = await fetchMessages(localeMessages);

  return (
    <NextIntlClientProvider
      messages={{
        ...messages,
      }}
    >
      <Client data={pageStructure.data} themeName={themeName || ""} configType={configType} />
      <WishlistMarker />
    </NextIntlClientProvider>
  );
}

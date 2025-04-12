import { ISearchParams } from "@znode/types/search-params";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { SEO_TYPES } from "@znode/constants/seo-types";
import { fetchMessages, getPortalHeader } from "@znode/utils/server";
import { getSeoData } from "@znode/agents/robot-tag/robot-tag";
import Client from "../../client";
import { NotFound } from "@znode/base-components/components/not-found";
import { WishlistMarker } from "@znode/base-components/common/wishlist-marker";
import { getPageStructure } from "@znode/page-builder/utils/get-page-structure";

export async function generateMetadata({ params }: { params: { id: number }; searchParams: ISearchParams }): Promise<Metadata | null> {
  const seoDetails = await getSeoData(undefined, params.id, SEO_TYPES.PRODUCT);
  return seoDetails;
}

const localeMessages = ["Product", "Common", "Pagination", "Addon", "Price", "WishList", "Inventory", "Email", "WishList"];
async function ProductDetailPage({ params, searchParams }: { params: { id: number }; searchParams: ISearchParams }) {
  const themeName = (await getPortalHeader()).themeName || process.env.DEFAULT_THEME;

  const url = "product/" + params.id;
  let configType = "product";
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
    <NextIntlClientProvider messages={{ ...messages }}>
      <Client data={pageStructure.data} themeName={themeName || ""} configType={configType} />
      <WishlistMarker />
    </NextIntlClientProvider>
  );
}

export default ProductDetailPage;

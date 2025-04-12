/* eslint-disable no-console */
import { fetchMessages, getPortalHeader } from "@znode/utils/server";

import Client from "../client";
import { IPageStructure } from "@znode/types/visual-editor";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { NotFound } from "@znode/base-components/components/not-found";
import { SEO_SETTINGS } from "@znode/constants/seo-types";
import { WishlistMarker } from "@znode/base-components/common/wishlist-marker";
import { getPage } from "@znode/page-builder/utils/get-page";
import { getSeoData } from "@znode/agents/robot-tag/robot-tag";
import { validateAndGenerateSeoUrl } from "@znode/page-builder/utils/validate-and-generate-seo-url";
import { pageWidgetData } from "@znode/page-builder/utils/get-page-structure";
import { checkDefaultWidgetHasData } from "@znode/utils/common";
interface IParams {
  locale: string;
  slug: string[];
}
interface IPageProps {
  searchParams?: { [key: string]: string | undefined | null };
  params: IParams;
}

function getUrlFromParams(params: IParams) {
  let url = "home"; // Default URL to Home Page
  if (params?.slug) {
    url = params.slug;
  }

  return url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: { params: { slug: string }; searchParams: any }): Promise<Metadata | null> {
  const seoDetails = await getSeoData(decodeURIComponent(params.slug));
  return seoDetails;
}

const localeMessages = [
  "Blog",
  "Product",
  "Barcode",
  "Common",
  "Layout",
  "DropDown",
  "Facet",
  "Pagination",
  "FacetChipList",
  "Addon",
  "Price",
  "StoreLocator",
  "Email",
  "Inventory",
  "WishList",
];

const getContentPageDetails = async (url: string) => {
  const seoData = await validateAndGenerateSeoUrl(url);
  let contentPageCode;
  let contentPageId;
  if (seoData) {
    const seoTypeName = String(seoData.name).toLowerCase();
    const seoId = seoData.seoId;
    url = `${seoTypeName}/${seoId}`;
    if (seoTypeName === SEO_SETTINGS.CONTENT_PAGE) {
      contentPageCode = seoData.seoCode;
      contentPageId = seoData.seoId;
    } else if (seoTypeName === SEO_SETTINGS.BLOG_NEWS) {
      url = `blog/${seoData.seoCode}`;
    } else if (seoTypeName === SEO_SETTINGS.BRAND) {
      url = `brand/${seoData.seoCode}`;
    }
  }
  return { updatedUrl: url, contentPageCode, contentPageId };
};
const getPageStructure = async (url: string, searchParams: { [key: string]: string | undefined | null } | undefined, themeName: string) => {
  const { updatedUrl, contentPageCode, contentPageId } = await getContentPageDetails(url);

  const pageStructure: IPageStructure = await getPage({
    url: updatedUrl,
    searchParams,
    theme: themeName, // theme1, theme2
    contentPageCode,
    contentPageId,
  });
  return { pageStructure, updatedUrl };
};

const get404PageStructure = async (themeName: string) => {
  return await getPageStructure("404", {}, themeName);
};

const isPageUnavailable = (pageStructure: IPageStructure) => {
  return pageStructure.data?.isPageUnavailable;
};

const getConfigType = (url: string) => {
  let configType = "common";
  if (url.startsWith("category")) {
    configType = "category";
  } else if (url.startsWith("product")) {
    configType = "product";
  } else if (url.startsWith("content")) {
    configType = "content";
  } else if (url.startsWith("brand/list")) configType = "brand";
  else if (url.startsWith("brand")) configType = "brand-details";
  else if (url.startsWith("blog/list")) configType = "blog";
  else if (url.startsWith("blog")) configType = "blog-details";
  else if (url.startsWith("store-locator")) configType = "store-locator";
  else if (url.startsWith("contactus")) configType = "contactus";
  else if (url.startsWith("feedback")) configType = "feedback";

  return configType;
};
export default async function page(props: Readonly<IPageProps>) {
  const url = getUrlFromParams(props.params);
  const themeName = (await getPortalHeader()).themeName || (process.env.DEFAULT_THEME as string);
  let pageStructure;
  let configType = "common";
  let viewCustom404 = false; // for viewing custom 404 page
  let is404 = false; // for rendering <NotFound/> component

  const fetchPageData = async () => {
    const data = await getPageStructure(url, props.searchParams, themeName);
    return { pageStructure: data.pageStructure, updatedUrl: data.updatedUrl };
  };

  const checkFor404 = async () => {
    const data = await get404PageStructure(themeName);
    const updatedConfigType = getConfigType(data.updatedUrl);
    const isUnavailable = isPageUnavailable(data.pageStructure) ?? false;
    is404 = isUnavailable;
    viewCustom404 = isUnavailable;
    configType = updatedConfigType;
    return {
      updatedPageStructure: data.pageStructure,
    };
  };
  // fetching initial page structure data
  const data = await fetchPageData();
  pageStructure = data.pageStructure;
  configType = getConfigType(data.updatedUrl);

  // check if page does not have any content then check for 404 content page then check for custom 404
  if (!pageStructure.data.content.length) {
    if (isPageUnavailable(pageStructure)) {
      const data = await checkFor404();
      pageStructure = data.updatedPageStructure;
    } else is404 = true;
  }
  // if page do not have main widget i.e product, category, blog, brand then check for 404 content page then check for custom 404
  else if (pageWidgetData[configType] && checkDefaultWidgetHasData(pageStructure.data.content, pageWidgetData[configType], configType)) {
    const data = await checkFor404();
    pageStructure = data.updatedPageStructure;
  }

  if (is404) return <NotFound viewCustom404={viewCustom404} />;

  const messages = await fetchMessages(localeMessages);
  return (
    <NextIntlClientProvider locale="en" messages={{ ...messages }}>
      <Client data={pageStructure?.data} themeName={themeName || ""} configType={configType} />
      <WishlistMarker />
    </NextIntlClientProvider>
  );
}

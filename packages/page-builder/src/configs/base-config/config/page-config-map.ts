
import type { IPageConfig } from "../../../types/page-builder";

export const getPageConfig = async (pageType: string): Promise<IPageConfig | null> => {
  switch (pageType) {
    case "category":
      return {
        components: {
          ProductListPage: (await import("../widgets/page-widgets/product/product-list-page/ProductListPageConfig")).ProductListPageConfig,

        },
        removeComponentKeys: [],
      };

    case "product":
      return {
        components: {
          ProductDetailsPage: (await import("../widgets/page-widgets/product/product-details-page/ProductDetailsPageConfig")).ProductDetailsPageConfig,
        },
        removeComponentKeys: [],
      };

    case "content":
      return {
        components: {
        ContentPage: (await import("../widgets/page-widgets/content/content-page/ContentPageConfig")).ContentPageConfig,
        },
        removeComponentKeys: [],
      };

    case "blog-list":
      return {
        components: {
          BlogPage: (await import("../widgets/page-widgets/blog/blog-page/BlogPageConfig")).BlogPageConfig,
        },
        removeComponentKeys: [],
      };

    case "blog-details":
      return {
        components: {
          BlogDetailsPage: (await import("../widgets/page-widgets/blog/blog-details-page/BlogDetailsPageConfig")).BlogDetailsPageConfig,
        },
        removeComponentKeys: [],
      };

    case "brand-list":
      return {
        components: {
          BrandsPage: (await import("../widgets/page-widgets/brand/brands-page/BrandsPageConfig")).BrandsPageConfig,
        },
        removeComponentKeys: [],
      };
    case "brand-details":
      return {
        components: {
          BrandDetailsPage: (await import("../widgets/page-widgets/brand/brand-details-page/BrandDetailsPageConfig")).BrandDetailsPageConfig,
        },
        removeComponentKeys: [],
      };

    case "store-locator":
      return {
        components: {
          StoreLocatorPage: (await import("../widgets/page-widgets/store-locator/StoreLocatorPageConfig")).StoreLocatorPageConfig,
        },
        removeComponentKeys: [],
      };

    case "contact-us":
      return {
        components: {
          ContactUsPage: (await import("../widgets/page-widgets/contact-us/ContactUsPageConfig")).ContactUsPageConfig,
        },
        removeComponentKeys: [],
      };

    case "feedback":
      return {
        components: {
          FeedbackPage: (await import("../widgets/page-widgets/feedback/FeedbackPageConfig")).FeedbackPageConfig,
        },
        removeComponentKeys: [],
      };
    default:
      return null;
  }
};
import type { IPageConfig, IPageConfigMap } from "../../../types/page-builder";
import { FooterConfig, HeaderConfig } from "../widgets/ui-widgets";
import { getLinkPanelConfig, getTickerConfig } from "../widgets/znode-widgets";

//**  Mapping of config types to their respective page configs
export const pageConfigMap: IPageConfigMap = new Map<string, IPageConfig>([
  [
    "header",
    {
      components: {
        Header: HeaderConfig,
        Ticker: getTickerConfig({
          insert: true,
          drag: true,
        }),
        LinkPanel: getLinkPanelConfig({
          delete: false,
          drag: false,
          duplicate: false,
          insert: false,
        }),
      },
      addComponentToCategories: [
        {
          categoryKey: "znodeWidgets",
          componentKeys: ["Ticker"],
        },
      ],
      removeComponentKeys: [
        {
          categoryKey: "others",
          componentKeys: ["Footer"],
        },
        {
          categoryKey: "znodeWidgets",
          componentKeys: ["BannerSlider", "CategoriesCarousel", "OfferBanner", "ProductsCarousel", "AdSpace", "HomePagePromo", "Image", "Video", "NewsLetter"],
        },
        {
          categoryKey: "uiWidgets",
          componentKeys: ["Text", "Heading", "ButtonGroup", "TextImage", "DynamicWidget", "RichTextWidget"],
        },
        {
          categoryKey: "layoutWidgets",
          componentKeys: ["Flex", "Column", "VerticalSpacing"],
        },
      ],
      disabled: true,
    },
  ],
  [
    "footer",
    {
      components: { Footer: FooterConfig },
      removeComponentKeys: [
        {
          categoryKey: "others",
          componentKeys: ["Header"],
        },
        {
          categoryKey: "znodeWidgets",
          componentKeys: ["BannerSlider", "CategoriesCarousel", "OfferBanner", "ProductsCarousel", "AdSpace", "HomePagePromo", "NewsLetter", "Ticker"],
        },
        {
          categoryKey: "uiWidgets",
          componentKeys: ["ButtonGroup", "TextImage", "DynamicWidget", "RichTextWidget"],
        },
      ],
      disabled: true,
    },
  ],
]);
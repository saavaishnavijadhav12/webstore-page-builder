// ***Znode Widgets
import {
  AdSpaceConfig,
  BannerSliderConfig,
  CategoriesCarouselConfig,
  HomePagePromoConfig,
  ImageConfig,
  LinkPanelConfig,
  NewsLetterConfig,
  OfferBannerConfig,
  ProductsCarouselConfig,
  VideoConfig,
} from "../widgets/znode-widgets";
// ***UI Widgets
import { ButtonGroupConfig, ColumnConfig, DynamicWidgetConfig, FlexConfig, HeadingConfig, TextConfig, TextImageConfig, VerticalSpaceConfig, RichTextWidgetConfig } from "../widgets/ui-widgets";
import type { IComponentCategories, IComponentPropsWithoutPages, IRootProps } from "../../../types/page-builder";

import { type Config } from "@measured/puck";

export type IBaseComponentsConfig = Config<IComponentPropsWithoutPages, IRootProps, IComponentCategories>;

export const baseComponentsConfig: IBaseComponentsConfig = {
  components: {
    // UI Widgets
    VerticalSpacing: VerticalSpaceConfig,
    Column: ColumnConfig,
    Flex: FlexConfig,
    Text: TextConfig,
    // Card: CardConfig,
    // Hero: HeroConfig,
    // Logo: LogoConfig,
    Heading: HeadingConfig,
    ButtonGroup: ButtonGroupConfig,
    TextImage: TextImageConfig,
    DynamicWidget: DynamicWidgetConfig,
    RichTextWidget: RichTextWidgetConfig,
    // Znode Widgets
    BannerSlider: BannerSliderConfig,
    CategoriesCarousel: CategoriesCarouselConfig,
    OfferBanner: OfferBannerConfig,
    ProductsCarousel: ProductsCarouselConfig,
    AdSpace: AdSpaceConfig,
    HomePagePromo: HomePagePromoConfig,
    Image: ImageConfig,
    Video: VideoConfig,
    // TextEditor: TextEditorConfig,
    NewsLetter: NewsLetterConfig,
    LinkPanel: LinkPanelConfig,
  },
  categories: {
    layoutWidgets: {
      components: ["Flex", "Column", "VerticalSpacing"],
      title: "Layout",
    },
    uiWidgets: {
      components: ["Text", "Heading", "ButtonGroup", "TextImage", "DynamicWidget", "RichTextWidget"],
      title: "UI Widgets",
    },
    znodeWidgets: {
      components: ["BannerSlider", "CategoriesCarousel", "OfferBanner", "ProductsCarousel", "AdSpace", "HomePagePromo", "Image", "Video", "NewsLetter", "LinkPanel"],
      title: "Znode Widgets",
    },
  },
};

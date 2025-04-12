import {  IMegaMenuCategory } from "./category";
import { IAnalytics } from "./common";
import { IPortalLocale } from "./portal";

export interface IHeaderConfig {
  logo: {
    url: string;
  };
  search: {
    barcode: boolean;
    voiceBasedSearch: boolean;
  };
  changeLocale: {
    enable: boolean;
  };
  links: {
    quickOrder: {
      enable: boolean;
    };
    signIn: {
      enable: boolean;
    };
  };
};


export interface IHeaderDetails {
  configuration: IHeaderConfig;
  headerDetails: ICommonHeaderDetails;
}

export interface ICommonHeaderDetails {
  categories: IMegaMenuCategory[];
  isUserLoggedIn: boolean;
  portalLocales: IPortalLocale[];
  analyticsInfo: IAnalytics;
  cartCount: number;
};
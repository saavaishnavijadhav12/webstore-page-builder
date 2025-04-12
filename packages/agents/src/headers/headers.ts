import { AREA, errorStack, logServer } from "@znode/logger/server";
import { getPortalDetails } from "../portal/portal";
import { IHeaderDetails } from "@znode/types/headers";
import ImageAssets from "@znode/utils/assets";
import { IUser } from "@znode/types/user";
import { getSavedUserSession } from "@znode/utils/common";
import { IPortalLocale } from "@znode/types/portal";
import { getNavigationCategory } from "../category";
import { APP_NAME } from "@znode/constants/app";
export const defaultHeaderConfig = {
  logo: {
    url: ImageAssets.noImage,
  },
  search: {
    barcode: false,
    voiceBasedSearch: false,
  },
  changeLocale: {
    enable: true,
  },
  links: {
    quickOrder: {
      enable: false,
    },
    signIn: {
      enable: true,
    },
  },
};

export async function getHeaderInitialDetails(): Promise<IHeaderDetails> {
  try {
    const requiredProperties = [
      "PortalId",
      "LocaleId",
      "PortalLocales",
      "ContainerId",
      "AnalyticsUId",
      "IsEnabledTagManager",
      "AnalyticsIsActive",
      "EnableEnhancedEcommerce",
      "MediaServerUrl",
      "WebsiteLogo",
      "PortalFeatureValues",
      "TrackingPixelScriptCode",
    ];
    const portalData = await getPortalDetails(requiredProperties);
    const {
      portalLocales,
      containerId,
      analyticsUId,
      isEnabledTagManager,
      analyticsIsActive,
      enableEnhancedEcommerce,
      mediaServerUrl,
      websiteLogo,
      portalFeatureValues,
      trackingPixelScriptCode,
    } = portalData || {};
    const { enableBarcodeScanner, enableVoiceBasedSearch } = portalFeatureValues || {};
    const userData: IUser | null = await getSavedUserSession();
    const formattedPortalLocales =
      (portalLocales &&
        portalLocales.map((locale: IPortalLocale) => ({
          localeId: locale.localeId,
          name: locale.name,
          code: locale.code,
          isDefault: locale.isDefault,
          isActive: locale.isActive,
        }))) ||
      [];
    const analyticsInfo = {
      containerId: containerId || "",
      analyticsUId: analyticsUId || "",
      isEnabledTagManager: isEnabledTagManager || false,
      isEnabledAnalytics: analyticsIsActive || false,
      isEnabledEnhancedEcommerce: enableEnhancedEcommerce || false,
      trackingPixelScript: trackingPixelScriptCode || "",
    };
    const appName = process.env.APP_NAME;
    const { categories, isUserLoggedIn } = appName !== APP_NAME.PAGE_BUILDER ? await getNavigationCategory(userData || undefined) : { categories: [], isUserLoggedIn: false };
    if (mediaServerUrl && websiteLogo && websiteLogo !== "") {
      defaultHeaderConfig.logo.url = `${mediaServerUrl}${websiteLogo}`;
    }
    defaultHeaderConfig.search.barcode = enableBarcodeScanner || false;
    defaultHeaderConfig.search.voiceBasedSearch = enableVoiceBasedSearch || false;
    return {
      configuration: defaultHeaderConfig || [],
      headerDetails: { categories, isUserLoggedIn, portalLocales: formattedPortalLocales, analyticsInfo, cartCount: 0 },
    };
  } catch (error) {
    logServer.error(AREA.HEADERS, errorStack(error));
    return {
      configuration: defaultHeaderConfig,
      headerDetails: {
        categories: [],
        isUserLoggedIn: false,
        portalLocales: [],
        analyticsInfo: {
          containerId: "",
          analyticsUId: "",
          isEnabledTagManager: false,
          isEnabledAnalytics: false,
          isEnabledEnhancedEcommerce: false,
          trackingPixelScript: "",
        },
        cartCount: 0,
      },
    } as IHeaderDetails;
  }
}

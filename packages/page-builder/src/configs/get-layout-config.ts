import { isArray } from "lodash";
import { IConfigParam } from "../types/page-builder";
import { getRootConfig as getBaseRootConfig } from "./base-config/config/root-config-layout";
const configCache = new Map<string, any>();

const themeConfigMap = new Map([
  ["samplecontent", getBaseRootConfig], // common and core config, which is use to every custom theme or override.
]);

export function getConfig(params: IConfigParam | IConfigParam[]) {
let layoutRootConfig;
  if(params && isArray(params)) {
   layoutRootConfig = params.map((param: IConfigParam) => {
    const cacheKey = `${param.theme}-${param.configType}`;
    if (configCache.has(cacheKey)) {
      return configCache.get(cacheKey);
    }
    const themeConfig = themeConfigMap.get(param.theme.toLowerCase());
    const rootConfig = themeConfig && themeConfig(param);
    configCache.set(cacheKey, rootConfig);
    console.log("rootConfig:::::::::::", rootConfig);
    return rootConfig
    });
  }
  else {
    const cacheKey = `${params.theme}-${params.configType}`;
    if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey);
  }
  const themeConfig = themeConfigMap.get(params.theme.toLowerCase());
  const rootConfig = themeConfig && themeConfig(params);
  configCache.set(cacheKey, rootConfig);
  layoutRootConfig = rootConfig;
  }

  return layoutRootConfig;
}
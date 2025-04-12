import { IConfigParam } from "../types/page-builder";
import { getRootConfig } from "./base-config/config/root-config";
const configCache = new Map<string, any>();

export async function getConfig(params: IConfigParam) {
  const cacheKey = `${params.theme}-${params.configType}`;
  if (configCache.has(cacheKey)) {
    return configCache.get(cacheKey);
  }


  const theme = params.theme.toLowerCase();

  let rootConfigGetter: (params: IConfigParam) => Promise<any>;
  
  switch (theme) {
    case "theme1":
      rootConfigGetter = (await import("./theme1-config/config/root-config")).getRootConfig as any;
      break;
    case "theme2":
      rootConfigGetter = (await import("./theme2-config/config/root-config")).getRootConfig as any;
      break;
    case "safetygear":
      rootConfigGetter = (await import("./safetygear-config/config/root-config")).getRootConfig as any;
      break;
    case "bstore":
      rootConfigGetter = (await import("./bstore-config/config/root-config")).getRootConfig as any;
      break;
    case "common":
    default:
      rootConfigGetter = getRootConfig as any;
      break;
  }

  const resolvedConfig = await rootConfigGetter(params);

  configCache.set(cacheKey, resolvedConfig);
  return resolvedConfig;
}
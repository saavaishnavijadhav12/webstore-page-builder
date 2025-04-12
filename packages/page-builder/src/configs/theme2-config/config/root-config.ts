import type { IConfigParam } from "../../../types/page-builder";
import { extendConfig, IComponents } from "../../base-config/config/extend-config";
import { getPageConfig } from "../../base-config/config/page-config-map";

export async function getRootConfig(params: IConfigParam) {
  //** Override your components or add new components here!
  const addOrOverrideComponents: IComponents = {};

  const selectedConfig = await getPageConfig(params.configType) || {
    components: {},
    removeComponentKeys: [],
    disabled: false,
  };

  return extendConfig({
    addOrOverrideComponents: { ...addOrOverrideComponents, ...selectedConfig.components },
    removeComponentKeys: selectedConfig.removeComponentKeys,
    disabled: selectedConfig.disabled,
  });
}

import type { IConfigParam } from "../../../types/page-builder";
import { extendConfig, IComponents } from "../../base-config/config/extend-config";
import { getPageConfig } from "../../base-config/config/page-config-map";
import { ButtonConfig } from "../widgets/ui-widgets/button/ButtonConfig";
import { CardConfig } from "../widgets/ui-widgets/card/CardConfig";

export async function getRootConfig(params: IConfigParam) {
  //** Override your components or add new components here!
  const addOrOverrideComponents: IComponents = {
    SafetygearButton: ButtonConfig,
    Card: CardConfig,
  };

  const selectedConfig = await getPageConfig(params.configType) || {
    components: {},
    removeComponentKeys: [],
    disabled: false,
    addComponentToCategories: [],
  };

  return extendConfig({
    addOrOverrideComponents: { ...addOrOverrideComponents, ...selectedConfig.components },
    removeComponentKeys: selectedConfig.removeComponentKeys,
    disabled: selectedConfig.disabled,
    addComponentToCategories: selectedConfig.addComponentToCategories,
  });
}

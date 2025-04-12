import type { ComponentConfig } from "@measured/puck";
import DataStateHandler from "packages/page-builder/src/component/data-handler/DataStateHandler";
import { DynamicWidgetRender } from "./DynamicWidgetRender";
import { IRenderProps } from "../../../../../types/page-builder";
import { WIDGET_CONFIGURATION_MESSAGES } from "packages/page-builder/src/constants/constants";

export type IDynamicWidgetConfig = {
  text: string;
};

export type IDynamicWidgetRenderProps = IDynamicWidgetConfig & IRenderProps;

export const DynamicWidgetConfig: ComponentConfig<IDynamicWidgetConfig> = {
  fields: {
    text: { label: "Enter your dynamic Html, Css & Js.", type: "textarea" },
  },
  defaultProps: {
    text: "<h1 class='text-4xl font-extrabold'>Enter your HTML, CSS, JavaScript, or text.</h1>",
  },
  label: "Dynamic Widget",
  render: (props: IDynamicWidgetRenderProps) => {
    return (
      <DataStateHandler response={props.text} emptyMessage={WIDGET_CONFIGURATION_MESSAGES.TEXT_CONFIGURATION_REQUIRED}>
        <DynamicWidgetRender {...props} />
      </DataStateHandler>
    );
  },
};

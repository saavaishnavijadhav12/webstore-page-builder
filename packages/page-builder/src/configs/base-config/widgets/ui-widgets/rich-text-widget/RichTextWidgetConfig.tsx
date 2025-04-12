import type { ComponentConfig } from "@measured/puck";
import { RichTextWidgetRender } from "./RichTextWidgetRender";
import { IPageOrWidgetConfig, IRenderProps } from "../../../../../types/page-builder";
import { RichTextEditorWrapper } from "../../../../../component/rich-text-editor/RichTextEditorWrapper";

export type IRichTextWidgetConfig = {
  text: string;
  config?: Omit<IPageOrWidgetConfig, "widgetConfig">;
};

export type IRichTextWidgetRenderProps = IRichTextWidgetConfig & IRenderProps;

export const RichTextWidgetConfig: ComponentConfig<IRichTextWidgetConfig> = {
  fields: {
    text: {
      label: "Text Label",
      type: "custom",
      render: ({ onChange, value }) => {
        return <RichTextEditorWrapper value={value} onChange={onChange} />;
      },
    },
  },
  defaultProps: {
    text: "",
    config: {
      type: "Window",
      id: "RichTextWidget",
      hasConfigurable: true,
    },
  },
  label: "Rich Text Widget",
  render: (props: IRichTextWidgetRenderProps) => {
    return <RichTextWidgetRender {...props} />;
  },
};

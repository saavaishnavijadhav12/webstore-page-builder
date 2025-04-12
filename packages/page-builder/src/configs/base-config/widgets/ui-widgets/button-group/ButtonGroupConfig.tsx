import { ButtonGroupRender } from "./ButtonGroupRender";
import { ComponentConfig } from "@measured/puck";
import { IRenderProps } from "../../../../../types/page-builder";

export interface IButtonGroupConfig {
  align?: string;
  buttons: { label: string; href: string; variant: "primary" | "secondary" }[];
}

export type IButtonGroupRenderProps = IButtonGroupConfig & IRenderProps;
export const ButtonGroupConfig: ComponentConfig<IButtonGroupConfig> = {
  label: "Button Group",
  fields: {
    buttons: {
      label: "Buttons",
      type: "array",
      getItemSummary: (item) => item.label || "Button",
      arrayFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "Href" },
        variant: {
          label: "Variant",
          type: "select",
          options: [
            { label: "primary", value: "primary" },
            { label: "secondary", value: "secondary" },
          ],
        },
      },
      defaultItemProps: {
        label: "Button",
        href: "#",
        variant: "primary",
      },
    },
    align: {
      label: "Align",
      type: "radio",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    buttons: [{ label: "Learn more", href: "#", variant: "primary" }],
  },
  render: (props: IButtonGroupRenderProps) => {
    return <ButtonGroupRender {...props} />;
  },
};

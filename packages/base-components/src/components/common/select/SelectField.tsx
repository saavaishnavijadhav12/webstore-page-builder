import { IAddressFieldProps } from "@znode/types/address";
import { SETTINGS } from "@znode/constants/settings";
import { ZIcons } from "../icons";
import { formatTestSelector } from "@znode/utils/common";

export const SelectField: React.FC<IAddressFieldProps> = ({ label, name, options, onChange }) => (
  <div className="pb-2">
    <div className="pb-2 required">
      <label className="font-semibold" data-test-selector={formatTestSelector("lbl", `${label}`)}>
        {label}
        <span className="ml-1 font-bold text-errorColor">*</span>
      </label>
    </div>
    <div className="relative">
      <select
        data-test-selector={`drp${name}`}
        aria-label={label}
        className="appearance-none w-full h-10 px-2 py-1 border rounded-custom border-inputColor hover:border-black active:border-black focus:outline-none"
        onChange={onChange}
      >
        {options}
      </select>
      <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
        <ZIcons name="chevron-down" data-test-selector="svgPageArrowDown" color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} />
      </div>
    </div>
  </div>
);

/* eslint-disable newline-per-chained-call */
"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IShippingConstraint, IShippingConstraintProps } from "@znode/types/shipping";

import { DatePicker } from "../../../components/common/date-picker";
import Input from "../../common/input/Input";
import { SHIPPING } from "@znode/constants/shipping";
import { ShippingConstraints } from "@znode/types/enums";
import { getSelectedInHandDate } from "@znode/utils/component";
import { useCheckout } from "../../../stores/checkout";
import { useTranslationMessages } from "@znode/utils/component";

export function ShippingConstraint({ onShippingConstraintChange, onInHandDateChange, generalSetting }: IShippingConstraintProps) {
  const checkoutTranslations = useTranslationMessages("Checkout");
  const [shippingConstraintData, setShippingConstraintData] = useState<IShippingConstraint[]>();
  const { shippingConstraintCode, setShippingConstraintCode } = useCheckout();
  const [optionValue, setOptionValue] = useState<string>("");

  function getMembersNameAndDescription() {
    const enumKeys = Object.entries(ShippingConstraints);
    const result = enumKeys.map(([key, value]) => ({
      shippingConstraintCode: key,
      isSelected: false,
      description: value,
    }));
    return result;
  }

  const fetchShippingConstraints = useCallback(async () => {
    const shippingData = getMembersNameAndDescription();
    setShippingConstraintData(shippingData);
    setShippingConstraintCode((shippingData && shippingData?.find((code) => code.description == SHIPPING.SHIP_COMPLETE)?.description) || "");
    const initialShippingConstraintCode = shippingData?.find((code) => code.description === SHIPPING.SHIP_COMPLETE)?.description || "";
    setShippingConstraintCode(initialShippingConstraintCode);

    onShippingConstraintChange(initialShippingConstraintCode || "");

    const defaultInHandDate = getSelectedInHandDate();
    setOptionValue(defaultInHandDate);
    onInHandDateChange(defaultInHandDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchShippingConstraints();
    getSelectedInHandDate();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = async (shippingConstraintCode: string) => {
    setShippingConstraintCode(shippingConstraintCode);
    onShippingConstraintChange(shippingConstraintCode);
  };

  const renderShippingConstraint = () => {
    return (
      shippingConstraintData &&
      shippingConstraintData.length > 0 &&
      shippingConstraintData.map((constraintData: IShippingConstraint, i: number) => {
        return (
          <div className="flex items-center" key={i}>
            <Input
              type="radio"
              className="h-4 form-radio xs:w-4 accent-accentColor"
              id={`${constraintData?.shippingConstraintCode}`}
              checked={shippingConstraintCode === constraintData?.description}
              onChange={() => handleInputChange(constraintData?.description || "")}
              dataTestSelector={`chkShippingConstraint${constraintData?.shippingConstraintCode}`}
              ariaLabel="shipping constraint"
            />
            <label
              className="ml-4 font-semibold cursor-pointer"
              htmlFor={`${constraintData?.shippingConstraintCode}`}
              data-test-selector={`lblShippingConstraint${constraintData?.shippingConstraintCode}`}
            >
              {checkoutTranslations(constraintData?.description.charAt(0).toLowerCase() + constraintData?.description.slice(1))}
            </label>
          </div>
        );
      })
    );
  };

  const handleDateChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selectedDate = new Date(value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight

    if (value === "") {
      setOptionValue("");
      return;
    }
    if (selectedDate >= currentDate) {
      setOptionValue(value);
      onInHandDateChange(value);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderInHandDate = () => {
    const currentDate = new Date();
    const minDate = formatDate(currentDate);
    return (
      <>
        <p className="mr-5 font-semibold" data-test-selector="paraInHandsDate">
          {checkoutTranslations("inHandsDate")}:
        </p>
        <DatePicker
          selectedDate={optionValue ? optionValue : getSelectedInHandDate()}
          onDateChange={handleDateChange}
          minDate={minDate}
          maxDate=""
          generalSetting={generalSetting}
        />
      </>
    );
  };

  return (
    <div className="md:w-2/5">
      {shippingConstraintData && (
        <div className="sm:flex sm:flex-row md:justify-end">
          <div className="flex gap-4 mt-4 sm:flex-col sm:mt-0">
            <div className="items-center sm:flex sm:justify-between" data-test-selector="divInHandsDateContainer">
              {renderInHandDate()}
            </div>
            <div className="sm:flex sm:justify-between md:my-3" data-test-selector="divShippingConstrainsContainer">
              <p className="font-semibold sm:pr-7" data-test-selector="paraShippingConstrainsText">
                {checkoutTranslations("shippingConstrains")}:
              </p>
              <div className="flex flex-col pr-4" data-test-selector="divShippingConstrainsRadio">
                {renderShippingConstraint()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

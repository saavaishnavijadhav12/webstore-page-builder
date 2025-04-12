"use client";

import { usePriceFormatter } from "@znode/utils/component";

interface IFormatPrice {
  price: number;
  currencyCode: string;
}

export const FormatPriceWithCurrencyCode = (prop: IFormatPrice) => {
  const { price, currencyCode } = prop;
  const formattedValue = usePriceFormatter(price, currencyCode);
  return <>{formattedValue}</>;
};

"use client";

import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

export function usePriceFormatter(price: number, currencyCode: string) {
  const format = useFormatter();
  const [formattedPrice, setFormattedPrice] = useState<string>("");

  useEffect(() => {
    const formatPrice = async () => {
      if (price !== undefined && price != null && currencyCode) {
        const result = await format.number(price, {
          style: "currency",
          roundingPriority: "auto",
          currency: currencyCode || "USD",
          maximumFractionDigits: 2,
        });
        setFormattedPrice(result ? result.toString() : "");
      } else {
        setFormattedPrice("");
      }
    };

    formatPrice();
  }, [price, currencyCode, format]);

  return formattedPrice;
}

"use client";
import React, { useCallback, useEffect, useState } from "react";
import { ICalculateSummary, ITaxSummary } from "@znode/types/account";
import { IPortalDetail } from "@znode/types/portal";
import { FormatPriceWithCurrencyCode } from "../../common/format-price/";
import { useTranslationMessages } from "@znode/utils/component";
import { ICartSettings } from "@znode/types/cart";
import { cartPageSettings } from "../../../http-request/cart/cart-page-settings";
import { Separator } from "../../common/separator";

export const QuoteProductTotal = ({ quoteProductTotalData }: { quoteProductTotalData: ICalculateSummary; classNumber?: string }) => {
  const [quoteSetting, setQuoteSettings] = useState<ICartSettings>();
  const commonTranslations = useTranslationMessages("Common");
  const quoteTranslations = useTranslationMessages("Quote");
  const [currencyCode, setCurrencyCode] = useState<string>();

  const getCurrencyData = useCallback(async (currentPortal?: IPortalDetail) => {
    currentPortal?.currencyCode && setCurrencyCode(currentPortal?.currencyCode);
  }, []);

  useEffect(() => {
    !quoteSetting && getCurrencyData(quoteSetting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteSetting]);

  const getPortalPageSettings = async () => {
    const pageSettings = await cartPageSettings();
    setQuoteSettings(pageSettings);
  };

  useEffect(() => {
    getPortalPageSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-end mt-2">
      <div className="font-semibold w-full pr-2 md:w-1/3">
        <div className="mt-2">
          <div className="flex justify-between pb-3">
            <div className="w-25">{commonTranslations("subTotal")}</div>
            <p>
              + <FormatPriceWithCurrencyCode price={Number(quoteProductTotalData?.subTotal) || 0} currencyCode={currencyCode || "USD"} />
            </p>
          </div>
          <div className="flex justify-between pb-3">
            <p>{commonTranslations("shipping")}</p>
            <p>
              + <FormatPriceWithCurrencyCode price={Number(quoteProductTotalData?.shippingCost) || 0} currencyCode={currencyCode || "USD"} />
            </p>
          </div>
          {quoteProductTotalData?.handlingFee && Number(quoteProductTotalData?.handlingFee) > 0 && (
            <div className="flex justify-between pb-3">
              <p data-test-selector="paraShippingHandlingChargesLabel">{commonTranslations("shippingHandlingCharges")}</p>
              <p>
                + <FormatPriceWithCurrencyCode price={Number(quoteProductTotalData?.handlingFee) || 0} currencyCode={currencyCode || "USD"} />
              </p>
            </div>
          )}
          <div className="flex justify-between mb-1">
            <p>{commonTranslations("tax")}</p>
            <div className="text-right w-25">
              {" "}
              + <FormatPriceWithCurrencyCode price={Number(quoteProductTotalData?.taxCost) || 0} currencyCode={currencyCode || "USD"} />
            </div>
          </div>
          {quoteProductTotalData?.taxSummaryList && quoteProductTotalData?.taxSummaryList.length > 0 && (
            <div className="flex items-center justify-center mt-2">
              <table className="min-w-full border border-collapse border-gray-800" data-test-selector="tblQuoteTaxSummary">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">{commonTranslations("taxName")}</th>
                    <th className="p-2 border">{commonTranslations("rate")}</th>
                    <th className="p-2 border">{commonTranslations("taxFees")}</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteProductTotalData?.taxSummaryList.map((summary: ITaxSummary, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="p-2 text-center border">{summary.taxName}</td>
                        <td className="p-2 text-center border">{summary.rate}</td>
                        <td className="p-2 text-center border">{summary.tax}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex justify-between pb-2">
          <div className="text-lg">{quoteTranslations("quoteTotal")}</div>
          <p>
            <FormatPriceWithCurrencyCode price={Number(quoteProductTotalData?.total) || 0} currencyCode={currencyCode || "USD"} />
          </p>
        </div>
      </div>
    </div>
  );
};

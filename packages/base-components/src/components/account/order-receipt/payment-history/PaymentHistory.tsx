"use client";

import { FormatPriceWithCurrencyCode } from "../../../common/format-price";
import { IPaymentHistory } from "@znode/types/account";
import { useTranslationMessages } from "@znode/utils/component";

const PaymentHistory = ({ paymentHistoryList, currencyCode }: { paymentHistoryList: IPaymentHistory[]; currencyCode?: string }) => {
  const commonTranslations = useTranslationMessages("Common");

  const renderOrderListItems = (paymentHistory: IPaymentHistory, i: number) => {
    return (
      <div className="grid grid-cols-10 gap-4 border-b border-zinc-300 py-4" key={i} data-test-selector="divPaymentHistoryContainer">
        <div className="col-span-2">
          <p className="text-sm font-semibold" data-test-selector={`paraTransactionDate${i}`}>
            {paymentHistory.createdDate}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm" data-test-selector={`paraPaymentType${i}`}>
            {paymentHistory.paymentType}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm" data-test-selector={`paraPaymentStatus${i}`}>
            {paymentHistory.transactionStatus}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm" data-test-selector={`paraPaymentAmount${i}`}>
            <FormatPriceWithCurrencyCode price={(paymentHistory?.amount && Number(paymentHistory.amount)) || 0} currencyCode={(currencyCode && String(currencyCode)) || "USD"} />
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-sm" data-test-selector={`paraPaymentRemainingAmount${i}`}>
            <FormatPriceWithCurrencyCode
              price={(paymentHistory?.remainingOrderAmount && Number(paymentHistory.remainingOrderAmount)) || 0}
              currencyCode={(currencyCode && String(currencyCode)) || "USD"}
            />
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <h2 className="text-lg font-semibold uppercase tracking-wide border-b border-black pb-2 mb-4" data-test-selector="hdgPaymentHistory">
        {commonTranslations("PaymentHistory")}
      </h2>
      <div className="mx-2">
        <div className="grid grid-cols-10 gap-4" data-test-selector="divTitleContainer">
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold" data-test-selector="paraTitleOrderDate">
              {commonTranslations("date")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold" data-test-selector="paraTitlePaymentType">
              {commonTranslations("paymentType")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold" data-test-selector="paraTitlePaymentStatus">
              {commonTranslations("status")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold" data-test-selector="paraTitleAmount">
              {commonTranslations("amount")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600 font-semibold" data-test-selector="paraTitleAmountRemaining">
              {commonTranslations("amountRemaining")}
            </p>
          </div>
        </div>
        <div className="col-span-1"></div>
      </div>
      {paymentHistoryList && paymentHistoryList?.map((paymentHistory: IPaymentHistory, i: number) => renderOrderListItems(paymentHistory, i))}
    </>
  );
};

export default PaymentHistory;

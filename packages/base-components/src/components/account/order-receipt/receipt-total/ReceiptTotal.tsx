"use client";

import { FormatPriceWithCurrencyCode } from "../../../common/format-price";
import { IOrderDetails } from "@znode/types/account";
import { useTranslationMessages } from "@znode/utils/component";

export default function ReceiptTotal({
  receiptTotalData,
  isPendingPayment,
  currencyCode,
}: Readonly<{
  receiptTotalData: IOrderDetails;
  isPendingPayment?: string;
  currencyCode: string;
}>) {
  const commonTranslations = useTranslationMessages("Common");
  const ordersTranslations = useTranslationMessages("Orders");

  const { subTotal, total, returnCharges, taxCost, handlingFee, shippingDiscount, shippingCost, giftCardAmount, totalDiscount, csrDiscountAmount } =
    receiptTotalData.calculateSummary || {};
  return (
    <div className="flex md:justify-end" data-test-selector="divTotalContainer">
      <div className="font-semibold xs:w-full md:w-1/2 lg:w-1/3">
        <div className="flex justify-between pb-3">
          <p data-test-selector="paraSubTotalLabel">{commonTranslations("subTotal")}</p>
          <p data-test-selector="paraSubTotalAmount">
            <FormatPriceWithCurrencyCode price={subTotal || 0} currencyCode={currencyCode} />
          </p>
        </div>
        <div className="flex justify-between pb-3">
          <p data-test-selector="paraShippingCostLabel" className="w-3/4 break-words">
            {commonTranslations("shipping")}
            {receiptTotalData.shippingTypeName && receiptTotalData.shippingTypeName.trim().length && `(${receiptTotalData.shippingTypeName})`}
          </p>
          <p data-test-selector="paraShippingCost" className="flex">
            <span>+</span> <FormatPriceWithCurrencyCode price={shippingCost || 0} currencyCode={currencyCode} />
          </p>
        </div>

        {handlingFee && handlingFee > 0 ? (
          <div className="flex justify-between pb-3">
            <p data-test-selector="paraShippingHandlingChargesLabel">{commonTranslations("shippingHandlingCharges")}</p>
            <p data-test-selector="paraShippingHandlingCharges">
              + <FormatPriceWithCurrencyCode price={handlingFee} currencyCode={currencyCode} />
            </p>
          </div>
        ) : null}

        {taxCost !== 0 && (
          <div className="flex justify-between pb-3">
            <p data-test-selector="paraTaxLabel">{commonTranslations("tax")}</p>
            <p data-test-selector="paraTax">
              + <FormatPriceWithCurrencyCode price={taxCost || 0} currencyCode={currencyCode} />
            </p>
          </div>
        )}
        {shippingDiscount && shippingDiscount > 0 ? (
          <div className="flex justify-between pb-3">
            <p data-test-selector="paraShippingDiscountLabel">{ordersTranslations("shippingDiscount")}</p>
            <p data-test-selector="paraShippingDiscount">
              - <FormatPriceWithCurrencyCode price={shippingDiscount || 0} currencyCode={currencyCode} />
            </p>
          </div>
        ) : null}
        {totalDiscount !== 0 ? (
          <div className="flex justify-between pb-3">
            <p data-test-selector="paraDiscountLabel">{commonTranslations("discount")}</p>
            <p data-test-selector="paraDiscount">
              - <FormatPriceWithCurrencyCode price={totalDiscount || 0} currencyCode={currencyCode} />
            </p>
          </div>
        ) : null}
        {!!csrDiscountAmount && csrDiscountAmount > 0 ? (
          <div className="flex justify-between pb-3">
            <p data-test-selector="paraCSRDiscountLabel">{commonTranslations("csrDiscountAmount")}</p>
            <p data-test-selector="paraCSRDiscount">
              - <FormatPriceWithCurrencyCode price={csrDiscountAmount || 0} currencyCode={currencyCode} />
            </p>
          </div>
        ) : null}
        {returnCharges && returnCharges !== 0 ? (
          <div className="flex justify-between pb-3">
            <p data-test-selector="paraReturnChargesLabel" className="w-3/4 break-words">
              {ordersTranslations("returnCharges")} {`(${ordersTranslations("nonRefundedAmount")})`}
            </p>
            <p data-test-selector="paraReturnCharges">
              + <FormatPriceWithCurrencyCode price={returnCharges || 0} currencyCode={currencyCode} />
            </p>
          </div>
        ) : null}
        {giftCardAmount && giftCardAmount !== 0 ? (
          <div>
            <div className="flex justify-between pb-3">
              <p data-test-selector="paraVoucherAmountLabel">{ordersTranslations("voucherAmount")}</p>
              <p data-test-selector="paraVoucherAmount">
                - <FormatPriceWithCurrencyCode price={giftCardAmount || 0} currencyCode={currencyCode} />
              </p>
            </div>
          </div>
        ) : null}
        <div className="flex justify-between pt-3 border-t border-zinc-300">
          <p className="text-lg" data-test-selector="paraOrderTotalLabel">
            {isPendingPayment ? (
              <>
                {ordersTranslations("pendingOrder")} {commonTranslations("total")}
              </>
            ) : (
              ordersTranslations("orderTotal")
            )}
          </p>
          <p className="text-lg" data-test-selector="paraOrderTotal">
            <FormatPriceWithCurrencyCode price={total || 0} currencyCode={currencyCode} />
          </p>
        </div>
        <div></div>
      </div>
    </div>
  );
}

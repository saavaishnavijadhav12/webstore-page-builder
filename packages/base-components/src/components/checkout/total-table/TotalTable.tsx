"use client";

import { LoadingSpinner, ZIcons } from "../../common/icons";
import { useCartDetails, useCheckout } from "../../../stores";
import { useEffect, useState } from "react";

import Button from "../../common/button/Button";
import { FormatPriceWithCurrencyCode } from "../../common/format-price";
import { SETTINGS } from "@znode/constants/settings";
import { Separator } from "../../common/separator";
import { getCartNumber } from "../../../http-request/cart";
import { getCartSummary } from "../../../http-request/cart";
import { useTranslationMessages } from "@znode/utils/component";

interface ITotalTableProps {
  isFromQuote?: boolean;
  currencyCode: string;
}

//Note: Avalara Tax Implementation Pending, do not remove the commented code.

const TotalTable = ({ isFromQuote, currencyCode }: ITotalTableProps) => {
  const checkoutTranslations = useTranslationMessages("Checkout");
  const { cartSummaryRefresher } = useCartDetails();
  const { orderSummaryData, setOrderSummaryData } = useCheckout();

  const [isOrderSummaryLoading, setOrderSummaryLoading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [isTaxSummaryShow, setTaxSummaryShow] = useState(false);
  const isTaxSummaryAvailable = false; //cartModel?.TaxSummaryList && cartModel?.TaxSummaryList?.length > 0 ? true : false;
  // const taxData = { TaxSummaryList: cartModel?.TaxSummaryList, TaxMessageList: cartModel?.TaxMessageList };

  useEffect(() => {
    cartSummaryRefresher && reviewCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSummaryRefresher]);

  const reviewCart = async () => {
    setOrderSummaryLoading(true);
    const cartNumber = await getCartNumber();
    const orderSummaryData = await getCartSummary(cartNumber, undefined, undefined, isFromQuote);
    setOrderSummaryData(orderSummaryData);
    setOrderSummaryLoading(false);
  };

  const handleArrowClick = () => {
    if (isTaxSummaryShow) {
      setTaxSummaryShow(false);
    } else {
      setTaxSummaryShow(true);
    }
  };

  return (
    <div>
      <div className={`py-2 ${isOrderSummaryLoading ? "border-t" : ""}`}>
        {isOrderSummaryLoading ? (
          <div className="flex items-center justify-center h-48 pt-5 pb-5">
            <LoadingSpinner width="50px" height="50px" />
          </div>
        ) : orderSummaryData ? ( // Add this condition
          <div>
            <div className="font-semibold">
              <Separator />
              <div className="flex justify-between py-1" data-test-selector="divSubTotal">
                <p data-test-selector="paraSubTotalLabel">{checkoutTranslations("subTotal")}</p>
                <p data-test-selector="paraSubTotalAmount">
                  <FormatPriceWithCurrencyCode price={orderSummaryData.subTotal || 0} currencyCode={currencyCode} />
                </p>
              </div>
              {
                <div className="flex justify-between py-1" data-test-selector="divShippingCost">
                  <p data-test-selector="paraShippingCostLabel">{checkoutTranslations("shipping")}</p>
                  <p data-test-selector="paraShippingCost">
                    +<FormatPriceWithCurrencyCode price={orderSummaryData.shippingCost || 0} currencyCode={currencyCode} />
                  </p>
                </div>
              }
              {orderSummaryData.handlingFee && orderSummaryData.handlingFee > 0 ? (
                <div className="flex justify-between py-1">
                  <p data-test-selector="paraHandlingChargeLabel">{checkoutTranslations("handlingCharges")}</p>
                  <p data-test-selector="paraHandlingCharges">
                    +<FormatPriceWithCurrencyCode price={orderSummaryData.handlingFee} currencyCode={currencyCode} />
                  </p>
                </div>
              ) : null}
              {/* {cartModel?.ImportDuty != undefined && cartModel?.ImportDuty > 0 && (
          <div className="flex justify-between py-2">
            <p>{t("HandlingCharges")}</p>
            <p>
              <FormatPriceWithCurrencyCode Price={cartModel?.ImportDuty} CurrencyCode={currencyCode} />
            </p>
          </div>
        )} */}
              {orderSummaryData.taxCost !== undefined && orderSummaryData.taxCost > 0 && (
                //isTaxSummaryAvailable if is is true then show a dropdown arrow
                <div className="flex justify-between py-1" data-test-selector="divTax">
                  <p className="flex items-center" data-test-selector="paraTaxLabel">
                    <span data-test-selector="spnTax">{checkoutTranslations("tax")} </span>
                    {isTaxSummaryAvailable && (
                      <Button
                        type="text"
                        size="small"
                        dataTestSelector="btnDownArrow"
                        className={`ml-3 ${isTaxSummaryShow ? "rotate-180" : ""}`}
                        startIcon={<ZIcons name="chevron-down" height="25px" width="25px" strokeWidth={"1.5px"} color={`${SETTINGS.DEFAULT_ICONS_COLOR}`} />}
                        onClick={() => handleArrowClick()}
                      ></Button>
                    )}
                  </p>
                  <p data-test-selector="paraTax">
                    +<FormatPriceWithCurrencyCode price={orderSummaryData.taxCost} currencyCode={currencyCode} />
                  </p>
                </div>
              )}
              {orderSummaryData.shippingDiscount && orderSummaryData.shippingDiscount > 0 ? (
                <div className="flex justify-between py-2" data-test-selector="divShippingDiscount">
                  <p data-test-selector="paraShippingDiscountLabel">{checkoutTranslations("shippingDiscount")}</p>
                  <p data-test-selector="paraShippingDiscount">
                    -<FormatPriceWithCurrencyCode price={orderSummaryData.shippingDiscount} currencyCode={currencyCode} />
                  </p>
                </div>
              ) : null}
              {orderSummaryData.totalDiscount !== undefined && orderSummaryData.totalDiscount > 0 && (
                <div className="flex justify-between py-2" data-test-selector="divDiscount">
                  <p data-test-selector="paraDiscountLabel">{checkoutTranslations("discountSubTotal")}</p>
                  <p data-test-selector="paraDiscount">
                    -<FormatPriceWithCurrencyCode price={orderSummaryData.totalDiscount} currencyCode={currencyCode} />
                  </p>
                </div>
              )}
              <Separator />
              <div className="flex justify-between py-1 text-lg font-semibold " data-test-selector={isFromQuote ? "divQuoteTotalContainer" : "divOrderTotalContainer"}>
                <p data-test-selector="paraOrderTotalLabel">{isFromQuote ? checkoutTranslations("quoteTotal") : checkoutTranslations("orderTotal")}</p>
                <p data-test-selector="paraOrderTotalAmount">
                  <FormatPriceWithCurrencyCode price={orderSummaryData.total || 0} currencyCode={currencyCode} />
                </p>
              </div>
              {orderSummaryData.giftCardAmount !== 0 && (
                <div>
                  <div className="flex justify-between py-2">
                    <p data-test-selector="paraVoucherAmountLabel">{checkoutTranslations("voucherAmount")}</p>
                    <p data-test-selector="paraVoucherAmount">
                      - <FormatPriceWithCurrencyCode price={orderSummaryData.giftCardAmount || 0} currencyCode={currencyCode} />
                    </p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p data-test-selector="paraAmountToBePaidLabel">({checkoutTranslations("amountToBePaid")}</p>
                    <p data-test-selector="paraAmountToBePaid">
                      <FormatPriceWithCurrencyCode price={orderSummaryData.orderTotalWithoutVoucher || 0} currencyCode={currencyCode} />)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default TotalTable;

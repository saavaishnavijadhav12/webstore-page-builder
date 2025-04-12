"use client";

import { ICalculateSummary, ICommerceCollectionClassDetail } from "@znode/types/account";
import { ORDER, ORDER_DATA_TYPE } from "@znode/constants/order";
import { useEffect, useState } from "react";

import Button from "../../common/button/Button";
import { IAddress } from "@znode/types/address";
import { IGeneralSetting } from "@znode/types/general-setting";
import Link from "next/link";
import LoaderComponent from "../../common/loader-component/LoaderComponent";
import { QuoteCustomerInfo } from "./QuoteCustomerInfo";
import { QuoteDetails } from "./QuoteDetails";
import { QuoteProductList } from "./QuoteProductList";
import { QuoteProductTotal } from "./QuoteProductTotal";
import ReceiptBillingAddress from "../order-receipt/receipt-billing-address/ReceiptBillingAddress";
import ReceiptShippingAddress from "../order-receipt/receipt-shipping-address/ReceiptShippingAddress";
import { getGeneralSettingList } from "../../../../../base-components/src/http-request";
import { quoteOrderDetails } from "../../../http-request/account/quote/quote-details";
import { useTranslationMessages } from "@znode/utils/component";

export const QuoteReceipt = () => {
  const quoteTranslation = useTranslationMessages("Quote");
  const commonTranslation = useTranslationMessages("Common");

  const [quoteReceiptData, setReceiptData] = useState<ICommerceCollectionClassDetail>();
  const [classNumber, setClassNumber] = useState<string>();
  const [calculatedCart, setCalculatedCart] = useState<ICalculateSummary>();
  const [generalSetting, setGeneralSetting] = useState<IGeneralSetting>();

  const getGeneralDetails = async () => {
    const generalSetting = await getGeneralSettingList();
    setGeneralSetting(generalSetting);
  };

  useEffect(() => {
    getGeneralDetails();
  }, []);

  const quoteDetails = async () => {
    const quoteNumber = sessionStorage.getItem("ConvertedClassNumber") || "";
    setClassNumber(quoteNumber);
    const quoteModel = await quoteOrderDetails({ orderType: ORDER_DATA_TYPE.QUOTE, quoteNumber: quoteNumber });
    setReceiptData(quoteModel?.quoteData);
    setCalculatedCart(quoteModel?.calculateSummary);
  };

  useEffect(() => {
    quoteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalSetting]);

  const shippingConstraintCode = quoteReceiptData?.orderShipments?.isShipCompletely ? ORDER.SHIP_COMPLETE : "";

  if (!quoteReceiptData) {
    return <LoaderComponent width="50px" height="50px" isLoading={true} />;
  }

  return (
    <>
      <div className="flex items-center justify-between" data-test-selector="divQuoteOrderReceipt">
        <h1 className="mt-4 mb-4 text-2xl font-normal uppercase md:font-semibold" data-test-selector="hdgQuoteThankYouPara">
          {quoteTranslation("thankYouForYourQuoteRequest")}
        </h1>
        <div className="flex items-center justify-center no-print">
          <Button
            type="primary"
            size="small"
            className="px-5 mb-2 mr-2 me-2"
            ariaLabel="print button"
            dataTestSelector="btnQuoteReceiptPrint"
            onClick={() => {
              window.print();
            }}
          >
            {commonTranslation("print")}
          </Button>
        </div>
      </div>

      <div>
        {quoteReceiptData && (
          <div className="pb-4 mb-4">
            <p data-test-selector="paraThanksForShopping">
              {quoteTranslation("yourQuoteNumberIs")} <b>{classNumber} </b>
              <p className="no-print">
              {quoteTranslation("yourReviewData")}{" "}
              <Link className="text-linkColor hover:text-hoverColor media" data-test-selector="linkQuoteHistory" href="/account/quote/list">
                <u>{quoteTranslation("quoteHistory")}</u>
              </Link>
              </p>
            </p>
          </div>
        )}
      </div>
      <div className="justify-between gap-4 lg:flex">
        {quoteReceiptData && (
          <div className="w-full p-4 mr-2 rounded-md shadow-md">
            <QuoteDetails quoteDetailsData={quoteReceiptData} generalSetting={generalSetting} />
          </div>
        )}
        {quoteReceiptData && (
          <div className="w-full p-4 mt-4 rounded-md shadow-md md:mt-0">
            <QuoteCustomerInfo quoteDetailsData={quoteReceiptData} />
          </div>
        )}
      </div>
      <div className="mt-4 rounded-md shadow-md">
        <h1 className="px-5 py-4 mt-4 text-2xl font-semibold uppercase border-b" data-test-selector="hdgBillingShipping">
          {quoteTranslation("billingAndShipping")}
        </h1>
        <div className="grid grid-cols-2" data-test-selector="divReturnOrderReceipt">
          <div className="col-span-2 p-5 md:col-span-1" data-test-selector="divBillingAddressContainer">
            <ReceiptBillingAddress billingAddress={quoteReceiptData?.billingAddress as IAddress} />
          </div>

          <div className="col-span-2 p-5 md:col-span-1 break-inside-avoid-page" data-test-selector="divShippingAddressContainer">
            <ReceiptShippingAddress
              shippingAddress={quoteReceiptData?.shippingAddress as IAddress}
              shippingConstraint={quoteReceiptData?.shippingConstraintCode || shippingConstraintCode}
              inHandDate={quoteReceiptData?.inHandDate || ""}
              showShippingConstraint={quoteReceiptData?.isShippingConstraint || false}
              shippingType={quoteReceiptData?.shippingMethodName || ""}
              generalSetting={generalSetting}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">{quoteReceiptData && quoteReceiptData?.lineItemDetails && <QuoteProductList productList={quoteReceiptData?.lineItemDetails} />}</div>
      <div>{calculatedCart && <QuoteProductTotal quoteProductTotalData={calculatedCart} />}</div>
    </>
  );
};

"use client";

import { ICalculateSummary, IQuoteDetails } from "@znode/types/account";
import { useEffect, useState } from "react";

import Button from "../../common/button/Button";
import DisplayAddress from "../../address/display/DisplayAddress";
import { Heading } from "../../common/heading";
import { IAddress } from "@znode/types/address";
import { IGeneralSetting } from "@znode/types/general-setting";
import { IPaymentOption } from "@znode/types/payment";
import { LoadingSpinnerComponent } from "../../common/icons";
import { Modal } from "../../common/modal/Modal";
import { ORDER_DATA_TYPE } from "@znode/constants/order";
import PaymentApplicationLoader from "../../common/loader-component/PaymentApplicationLoader";
import { PaymentOptions } from "../../checkout/payment/payment-options/PaymentOptions";
import { QuoteCustomerInfo } from "./QuoteCustomerInfo";
import { QuoteDetails } from "./QuoteDetails";
import { QuoteProductList } from "./QuoteProductList";
import { QuoteProductTotal } from "./QuoteProductTotal";
import Table from "rc-table";
import { getGeneralSettingList } from "../../../http-request/common/common-client-api";
import { getPaymentConfigurations } from "../../../http-request";
import { quoteOrderDetails } from "../../../http-request/account/quote/quote-details";
import { useCheckout } from "../../../stores/checkout";
import { useModal } from "../../../stores";
import { useRouter } from "next/navigation";
import { useTranslationMessages } from "@znode/utils/component";

export const QuoteOrderDetails = ({ quoteNumber }: { quoteNumber: string }) => {
  const quoteTranslation = useTranslationMessages("Quote");
  const commonTranslations = useTranslationMessages("Common");

  const router = useRouter();

  const [quoteDetailsData, setQuoteDetailsData] = useState<IQuoteDetails>();
  const [calculatedCart, setCalculatedCart] = useState<ICalculateSummary>();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<IPaymentOption[]>();
  const [isPaymentProcessing, setPaymentProcessing] = useState(false);
  const { setShippingAddressId, setBillingAddressId } = useCheckout();
  const [generalSetting, setGeneralSetting] = useState<IGeneralSetting>();
  const { openModal } = useModal();

  const getPortalDetails = async () => {
    const generalSetting = await getGeneralSettingList();
    setGeneralSetting(generalSetting);
  };

  useEffect(() => {
    getPortalDetails();
  }, []);

  const handleConvertOrderClick = async () => {
    openModal("PaymentOptions");
    const paymentData = await getPaymentConfigurations();
    setPaymentMethod(paymentData);
  };

  const quoteDetails = async () => {
    const quoteData = await quoteOrderDetails({ orderType: ORDER_DATA_TYPE.QUOTE, quoteNumber: quoteNumber });
    if (!quoteData?.isSuccess) {
      router.push("/404");
    } else {
      setQuoteDetailsData(quoteData?.quoteData);
      setCalculatedCart(quoteData?.calculateSummary);
      quoteDetailsData?.shippingAddressId && setShippingAddressId(quoteDetailsData?.shippingAddressId);
      quoteDetailsData?.billingAddressId && setBillingAddressId(quoteDetailsData?.billingAddressId);
    }
    setIsLoading(false);
  };

  /**
   * Columns list which will display as header of the table
   */
  const columns = [
    {
      title: commonTranslations("date"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (createdDate: string) => createdDate,
    },
    {
      title: quoteTranslation("time"),
      dataIndex: "createdDate",
      key: "createdDate",
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (createdDate: string) => createdDate?.slice(-12, -7),
    },
    {
      title: quoteTranslation("updatedBy"),
      dataIndex: "userName",
      key: "userName",
      width: 100,
      render: (userName: string) => userName,
    },
    {
      title: quoteTranslation("notes"),
      dataIndex: "jobName",
      key: "jobName",
      width: 100,
      render: (jobName: string) => jobName,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    quoteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quoteDetailsList: IQuoteDetails[] = [];

  const renderOrderDetails = () => {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between my-2 lg:flex " data-test-selector="divReturnOrderReceipt">
          <Heading name={`${quoteTranslation("quoteOrderNumber")} ${quoteNumber}`} level="h2" customClass="xs:w-auto uppercase" dataTestSelector="hdgQuoteNumber" />
          <div className="no-print">
            <Button
              type="primary"
              size="small"
              className="mr-2 w-auto"
              dataTestSelector="btnQuotePrint"
              onClick={() => {
                window.print();
              }}
              ariaLabel="Print button"
            >
              {commonTranslations("print")}
            </Button>
            {quoteDetailsData && (
              <Button
                type="primary"
                size="small"
                className="w-auto"
                onClick={handleConvertOrderClick}
                dataTestSelector="btnConvertToOrder"
                disabled={!quoteDetailsData?.enableConvertToOrder}
                ariaLabel="convert to order button"
              >
                {quoteTranslation("convertToOrder")}
              </Button>
            )}
            <Modal customClass="overflow-y-auto w-full" modalId="PaymentOptions" size="3xl" maxHeight="xl">
              <div className="w-100">
                {paymentMethod ? (
                  <PaymentOptions
                    paymentOptions={paymentMethod}
                    isFromQuote={true}
                    quoteNumber={quoteNumber}
                    setPaymentProcessing={setPaymentProcessing}
                    isAddEditAddressOpen={{
                      isShippingAddressOpen: false,
                      isBillingAddressOpen: false,
                    }}
                    total={Number(quoteDetailsData?.total)}
                    isOfflinePayment={false}
                  />
                ) : (
                  <div className="flex justify-center w-100 h-96 align-center">
                    <LoadingSpinnerComponent minHeight="min-h-[50vh]" />
                  </div>
                )}
              </div>
            </Modal>
            <PaymentApplicationLoader isPaymentProcessing={isPaymentProcessing} />
          </div>
        </div>
        <div className="justify-between mb-4 lg:flex">
          {quoteDetailsData && (
            <div className="w-full mr-2">
              <QuoteDetails quoteDetailsData={quoteDetailsData} generalSetting={generalSetting} />
            </div>
          )}
          {quoteDetailsData && (
            <div className="w-full">
              <QuoteCustomerInfo quoteDetailsData={quoteDetailsData} />
            </div>
          )}
        </div>
        <div className="justify-between mb-4 lg:flex" data-test-selector="divReturnOrderReceipt">
          <div className="w-full mr-2">
            <Heading name={quoteTranslation("billingTo")} level="h3" dataTestSelector="hdgBillingTo" customClass="uppercase" showSeparator />
            <DisplayAddress userAddress={quoteDetailsData?.billingAddress as IAddress} addressType="Billing" />
          </div>
          <div className="w-full">
            <Heading name={quoteTranslation("shippingTo")} level="h3" dataTestSelector="hdgShippingTo" customClass="uppercase" showSeparator />
            <DisplayAddress
              userAddress={quoteDetailsData?.shippingAddress as IAddress}
              addressType="Shipping"
              shippingConstraint={quoteDetailsData?.shippingConstraintCode || ""}
              inHandDate={quoteDetailsData?.inHandDate || ""}
              showShippingConstraint={quoteDetailsData?.isShippingConstraint || false}
              shippingType={quoteDetailsData?.shippingMethodName}
            />
          </div>
        </div>
        <div>{quoteDetailsData?.lineItemDetails && <QuoteProductList productList={quoteDetailsData?.lineItemDetails} />}</div>
        <div>{calculatedCart && <QuoteProductTotal quoteProductTotalData={calculatedCart} />}</div>
        {quoteDetailsData?.jobName ? (
          <div className="mt-2 xs:overflow-x-scroll lg:overflow-x-hidden xs:w-full custom-scroll" data-test-selector="divOrderHistoryLink">
            <Table tableLayout="auto" columns={columns} data={quoteDetailsList} />
          </div>
        ) : (
          ""
        )}
      </>
    );
  };

  return loading ? (
    <LoadingSpinnerComponent minHeight="min-h-[50vh]" />
  ) : (
    <>
      <Heading name={quoteTranslation("quoteOrderDetails")} level="h2" dataTestSelector="hdgQuoteOrderDetails" customClass="uppercase" showSeparator /> {renderOrderDetails()}{" "}
    </>
  );
};

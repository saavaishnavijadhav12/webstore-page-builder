import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Heading from "../../../common/heading/Heading";
import { IPaymentOption } from "@znode/types/payment";
import Input from "../../..//common/input/Input";
import { LoadingSpinner } from "../../../common/icons";
import { PAYMENT_SUBTYPE } from "@znode/constants/payment";
import PaymentApplicationLoader from "../../../common/loader-component/PaymentApplicationLoader";
import { PaymentOptions } from "../../payment/payment-options/PaymentOptions";
import { getOfflinePaymentConfigurations } from "../../../../http-request/payment";
import { usePayment } from "../../../../stores";
import { useTranslations } from "next-intl";

export interface IRecord {
    orderNumber?: string;
    paymentType?: string;
    remainingOrderAmount?: string;
    userId?: number;
    total?: number;
}
interface InvoiceMeProps {
    currentRecord: IRecord | undefined;
    setPaymentProcessing: Dispatch<SetStateAction<boolean>>;
}

const InvoiceMe = (props: InvoiceMeProps) => {
    const [paymentOptions, setPaymentOptions] = useState<IPaymentOption[]>();
    const [isLoading, setIsLoading] = useState(true);
    const paymentTranslations = useTranslations("Payment");
    const [isPaymentProcessing, setPaymentProcessing] = useState<boolean>(false);
    const { payment } = usePayment();

    useEffect(() => {
        getPaymentOptions();
    }, []);

    async function getPaymentOptions() {
        const payment = await getOfflinePaymentConfigurations();
        setPaymentOptions(payment);
        setIsLoading(false);
    }

    const getPayableAmount = () => {
        let payableAmount = props.currentRecord?.total;
        const subTypeCode = payment.subTypeCode;
        if (subTypeCode && subTypeCode.toLowerCase() === PAYMENT_SUBTYPE.CREDIT_CARD.toLowerCase()) {
            return payableAmount;
        } else {
            payableAmount = props.currentRecord?.total;
        }
        return payableAmount;
    };

    const disablePaymentAmountField = () => {
        const subTypeCode = payment.subTypeCode;
        if (subTypeCode && subTypeCode.toLowerCase() === PAYMENT_SUBTYPE.ACH.toLowerCase())
            return false;
        else
            return true;
    };

  return (
    <div className="items-center justify-center">
      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <LoadingSpinner width="50px" height="50px" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <Heading name={paymentTranslations("makePayment")} customClass="uppercase" dataTestSelector="hdgMakePayment" />
          </div>
          <div className="payment-view-content">
            <h3> </h3>
            <h3 className="block-title text-left mb-2">
              {paymentTranslations("orderNumber")} : {props.currentRecord?.orderNumber}
            </h3>
            <h3 className="block-title text-left mb-2">
              {paymentTranslations("orderTotal")} : {props.currentRecord?.total}
            </h3>
            <h3 className="block-title text-left mb-2">
              {paymentTranslations("amountDue")} : {getPayableAmount()}
            </h3>
            <div className="mb-6">
              <Input
                type="number"
                className="px-2 py-1 w-1/2"
                id="myTextbox"
                placeholder=""
                disabled={disablePaymentAmountField()}
                value={getPayableAmount()}
                isLabelShow={true}
                label={paymentTranslations("paymentAmount")}
                isRequired={true}
                labelCustomClass="font-semibold"
                dataTestSelector="txtPaymentAmount"
              />
            </div>
            {paymentOptions && (
              <PaymentOptions
                paymentOptions={paymentOptions}
                setPaymentProcessing={setPaymentProcessing}
                total={props.currentRecord?.total ?? 0}
                jobName={""}
                additionalInstruction={""}
                isOfflinePayment={true}
              ></PaymentOptions>
            )}
          </div>
          <PaymentApplicationLoader isPaymentProcessing={isPaymentProcessing} />
        </>
      )}
    </div>
  );
};

export default InvoiceMe;
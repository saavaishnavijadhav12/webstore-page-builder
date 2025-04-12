import { IOrderDetails } from "@znode/types/account";
import { Heading } from "../../../common/heading";
import { useTranslationMessages } from "@znode/utils/component";
import { useTranslations } from "next-intl";

export const ViewReceiptDetails = ({ orderData, receiptDate, isFromOrderStatus = false }: { orderData: IOrderDetails; receiptDate: string; isFromOrderStatus?: boolean }) => {
  const orderTranslation = useTranslations("Orders");
  const commonTranslation = useTranslationMessages("Common");
  return (
    <>
      {!isFromOrderStatus && <Heading name={commonTranslation("details")} level="h3" dataTestSelector="hdgDetails" customClass="uppercase" showSeparator />}

      <div className="p-2">
        <div className="grid grid-cols-12 pb-2">
          <p className="col-span-5 font-medium" data-test-selector="paraDateLabel">
            {commonTranslation("date")}:
          </p>
          <p data-test-selector="paraDate" className="col-span-7 px-2">
            {receiptDate ?? "-"}
          </p>
        </div>
        <div className="grid grid-cols-12 pb-2">
          <p className="col-span-5 font-medium" data-test-selector="paraOrderLabel">
            {commonTranslation("order")}:
          </p>
          <p data-test-selector="paraOrderNumber" className="col-span-7 px-2">
            {orderData.orderNumber ?? "-"}
          </p>
        </div>
        <div className="grid grid-cols-12 pb-2">
          <p className="col-span-5 font-medium" data-test-selector="paraOrderStatusLabel">
            {orderTranslation("orderStatus")}:
          </p>
          <p data-test-selector="paraOrderNumber" className="col-span-7 px-2">
            {orderData.orderState ?? "-"}
          </p>
        </div>
        <div className="grid grid-cols-12 pb-2">
          <p className="col-span-5 font-medium" data-test-selector="paraPaymentLabel">
            {commonTranslation("payment")}:
          </p>
          <p data-test-selector="paraPayment" className="col-span-7 px-2">
            {orderData.paymentDisplayName ?? "-"}
          </p>
        </div>
        <div className="grid grid-cols-12 pb-2">
          <p className="col-span-5 font-medium" data-test-selector="paraTrackingLabel">
            {commonTranslation("trackingNumber")}:
          </p>
          <p data-test-selector="paraTrackingNumber" className="col-span-7 px-2">
            {orderData.trackingNumber ?? "-"}
          </p>
        </div>
        {orderData.jobName ? (
          <div className="grid grid-cols-12 pb-2">
            <p className="col-span-5 font-medium" data-test-selector="paraTrackingLabel">
              {commonTranslation("jobOrProjectName")}:
            </p>
            <p data-test-selector="paraJobName" className="col-span-7 px-2">
              {orderData.jobName ?? "-"}
            </p>
          </div>
        ) : null}
        {orderData.couponCode ? (
          <div className="grid grid-cols-12 pb-2">
            <p className="col-span-5 font-medium" data-test-selector="paraCouponCodeLabel">
              {commonTranslation("couponCode")}:
            </p>
            <p data-test-selector="paraCouponCode" className="col-span-7 px-2">
              {orderData.couponCode ?? "-"}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
};

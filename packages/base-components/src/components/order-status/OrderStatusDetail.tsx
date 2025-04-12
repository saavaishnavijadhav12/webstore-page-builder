import { IOrderDetails } from "@znode/types/account";
import { useTranslationMessages } from "@znode/utils/component";
import Button from "../common/button/Button";
import { Separator } from "../common/separator";
import { Heading } from "../common/heading";
import { ViewReceiptDetails } from "../account/order-receipt/receipt-details/ViewReceiptDetails";
import ReceiptBillingAddress from "../account/order-receipt/receipt-billing-address/ReceiptBillingAddress";
import ReceiptShippingAddress from "../account/order-receipt/receipt-shipping-address/ReceiptShippingAddress";
import ReceiptOrderSummary from "../account/order-receipt/receipt-order-summary/ReceiptOrderSummary";
import ReceiptTotal from "../account/order-receipt/receipt-total/ReceiptTotal";

export function OrderStatusDetails({ order }: { order: IOrderDetails | null }) {
  const orderMessages = useTranslationMessages("Orders");
  const commonMessages = useTranslationMessages("Common");
  if (order && Object.keys(order).length === 0) return null;
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <p className="font-medium md:text-xl" data-test-selector="hdgTitleOrderReceipt">
          {commonMessages("order")}: {order?.orderNumber}
        </p>

        <Button className="no-print" type="primary" size="small" dataTestSelector="btnPrint" onClick={() => window.print()}>
          {commonMessages("print")}
        </Button>
      </div>
      <Separator size="xs" customClass="mt-2" />

      <div className="p-2.5 mb-3 bg-navBgColor">
        <label className="font-semibold text-[17px]"> {orderMessages("status")}</label> : <span>{order?.orderState}</span>
      </div>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 print-display-flex">
        <div className="col-span-1">
          <Box title={orderMessages("orderDetails")}>
            <ViewReceiptDetails orderData={order as IOrderDetails} receiptDate={order?.createdDate || ""} isFromOrderStatus />
          </Box>
        </div>
        <div className="col-span-1">
          <Box title={orderMessages("billingTo")}>
            <div className="p-2">
              <ReceiptBillingAddress billingAddress={order?.billingAddress || ""} isFromOrderStatus />
            </div>
          </Box>
        </div>
        <div className="col-span-2 shipping-card-container">
          <Box title={orderMessages("shippingTo")}>
            <ReceiptShippingAddress
              shippingAddress={order?.shippingAddress || ""}
              shippingConstraint={order?.shippingConstraintCode || ""}
              showShippingConstraint={false}
              isFromOrderStatus
            />
            <Separator customClass="no-print" />
            <div className="p-2 break-inside-avoid-page">
              <div data-test-selector="divOrderSummaryContainer">
                <ReceiptOrderSummary orderSummaryData={order?.orderLineItems || []} orderNumber={order?.orderNumber || ""} orderData={order || null} isFromOrderStatus />
              </div>
              <ReceiptTotal receiptTotalData={order as IOrderDetails} currencyCode={order?.currencyCode || "USD"} />
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

const Box = ({ children, title = "" }: { children: React.ReactNode; title: string }) => {
  return (
    <div className="custom-shadow rounded-[4px] h-full">
      <Heading name={title} customClass="uppercase py-3 px-2 " dataTestSelector="hdgTrackOrder" level="h3" showSeparator />
      {children}
    </div>
  );
};

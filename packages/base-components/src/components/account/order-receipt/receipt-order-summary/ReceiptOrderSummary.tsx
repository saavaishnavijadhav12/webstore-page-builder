import { IOrderDetails, IOrderLineItem } from "@znode/types/account";
import React, { useEffect, useState } from "react";

import { FormatPriceWithCurrencyCode } from "../../../common/format-price";
import { Heading } from "../../../common/heading";
import { IReorderRequestModel } from "@znode/types/order";
import { NavLink } from "../../../common/nav-link";
import { ORDER_ORIGIN } from "@znode/constants/cart";
import RenderPersonalizedItems from "../../../common/personalized-item/RenderPersonalizedItems";
import { formatTestSelector } from "@znode/utils/common";
import { reorderOrder } from "../../../../http-request";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../stores/toast";
import { useTranslationMessages } from "@znode/utils/component";
import { useUser } from "../../../../stores";

interface IOrderSummaryData {
  orderSummaryData: IOrderLineItem[];
  isOrderStatus?: boolean;
  orderNumber: string;
  orderData: IOrderDetails | null;
  isFromOrderStatus?: boolean;
}

const ReceiptOrderSummary: React.FC<IOrderSummaryData> = ({ orderSummaryData, isOrderStatus = false, orderNumber, orderData, isFromOrderStatus = false }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const orderTranslation = useTranslationMessages("Orders");
  const commonTranslation = useTranslationMessages("Common");
  const router = useRouter();
  const { error } = useToast();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reorderSingleLineOrderItem = async (itemId: string) => {
    const reorderRequestModel: IReorderRequestModel = {
      orderNumber: orderNumber,
      itemId: itemId,
      orderOrigin: ORDER_ORIGIN.WEBSTORE_ORDER_ORIGIN,
    };
    await reorderOrder(reorderRequestModel).then((reorderStatus) => {
      if (reorderStatus) router.push("/cart");
      else error(orderTranslation("reorderFailed"));
    });
  };

  const renderTableHeaders = () => (
    <div className={`grid ${getGridColumns()} gap-4 mb-8 sm:mb-0 sm:text-left text-base`}>
      {["item", "description", "status", "trackingNumber", "quantity", "itemPrice", "totalPrice"].map((column, index) => (
        <HeaderCell key={index + index * 2} label={commonTranslation(column)} />
      ))}
      {(!isOrderStatus || !isFromOrderStatus) && <HeaderCell label="" />}
    </div>
  );

  const getGridColumns = () => (isOrderStatus || isFromOrderStatus ? "grid-cols-7" : "grid-cols-8");
  const renderOrderListItems = () =>
    orderSummaryData.map((orderItem, index) => (
      <OrderItemRow
        key={orderItem.id + index}
        orderItem={orderItem}
        isMobile={isMobile}
        isOrderStatus={isOrderStatus}
        reorderSingleLineOrderItem={reorderSingleLineOrderItem}
        commonTranslation={commonTranslation}
        orderData={orderData}
        isFromOrderStatus={isFromOrderStatus}
      />
    ));

  return (
    <>
      {!isFromOrderStatus && <Heading name={orderTranslation("orderSummary")} level="h3" dataTestSelector="hdgOrderSummary" customClass="uppercase" showSeparator />}
      <div className="w-full">
        {!isMobile && renderTableHeaders()}
        {renderOrderListItems()}
      </div>
    </>
  );
};

const HeaderCell = ({ label }: { label: string }) => {
  return (
    <div className={`col-span-10 sm:col-span-1 ${label === "Status" ? "print:ml-[20px]" : ""}`} data-test-selector={formatTestSelector("div", `${label}`)}>
      <p className="mb-0 font-semibold text-gray-600" data-test-selector={formatTestSelector("para", `${label}`)}>
        {label}
      </p>
    </div>
  );
};
interface OrderItemRowProps {
  orderItem: IOrderLineItem;
  isMobile: boolean;
  isOrderStatus: boolean;
  reorderSingleLineOrderItem: (_omsOrderLineItemsId: string) => Promise<void>;
  commonTranslation: (_key: string) => string;
  orderData: IOrderDetails | null;
  isFromOrderStatus?: boolean;
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({ orderItem, orderData, isMobile, isOrderStatus, reorderSingleLineOrderItem, commonTranslation, isFromOrderStatus }) => {
  const { name, sku, description, orderLineItemState, quantity, price, id, currencyCode } = orderItem;
  const trackingNumber = orderData?.trackingNumber || "-";
  const getGridColumns = () => (isOrderStatus || isFromOrderStatus ? "grid-cols-7" : "grid-cols-8");
  const { user } = useUser();
  const isGuest = user?.userId && user.userId > 0 ? false : true;
  return (
    <div
      className={`grid ${
        isMobile ? "w-full flex border-b my-4 justify-between" : getGridColumns()
      } gap-4 sm:border-b border-zinc-300 sm:py-4 xs:text-end sm:text-left text-sm md:text-base`}
      data-test-selector={formatTestSelector("div", `OrderItemRow${id}`)}
    >
      <OrderItemCell label="Item" content={name} sku={sku} isMobile={isMobile} personalizedContent={orderItem.personaliseValuesDetail} id={id} />
      <OrderItemCell label="Description" content={description || "-"} sku={sku} isMobile={isMobile} id={id} />
      <OrderItemCell label="Status" content={orderLineItemState || "-"} sku={sku} isMobile={isMobile} id={id} />
      <OrderItemCell label="TrackingNumber" content={trackingNumber} sku={sku} isMobile={isMobile} id={id} />
      <OrderItemCell label="Quantity" content={quantity.toString()} sku={sku} isMobile={isMobile} id={id} />
      <OrderItemCell label="ItemPrice" content={<FormatPriceWithCurrencyCode price={price || 0} currencyCode={currencyCode || "USD"} />} sku={sku} isMobile={isMobile} id={id} />
      <OrderItemCell
        label="TotalPrice"
        content={<FormatPriceWithCurrencyCode price={(price || 0) * quantity} currencyCode={currencyCode || "USD"} />}
        sku={sku}
        isMobile={isMobile}
        id={id}
      />
      {!isOrderStatus && !isGuest && !isFromOrderStatus && (
        <div className="col-span-10 sm:col-span-1 no-print flex justify-between xs:col-span-10 sm:block pb-3">
          {isMobile && <p className="mb-0 font-semibold text-gray-600 sm:text-right">{commonTranslation("reorder")}</p>}
          <NavLink
            url="javascript:void(0)"
            className="rounded-btnBorderRadius text-linkColor hover:text-hoverColor no-print"
            onClick={(e) => {
              e.preventDefault();
              reorderSingleLineOrderItem(id);
            }}
            dataTestSelector={formatTestSelector("link", `Reorder${sku}`)}
          >
            {commonTranslation("reorder")}
          </NavLink>
        </div>
      )}
    </div>
  );
};

interface IPersonalizedData {
  personalizeName?: string;
  personalizeValue?: string;
}

const OrderItemCell = ({
  label,
  content,
  sku,
  isMobile,
  personalizedContent,
  id,
}: {
  label: string;
  content: string | React.ReactNode;
  sku: string;
  isMobile: boolean;
  personalizedContent?: IPersonalizedData[];
  id?: string;
}) => (
  <div className={`xs:col-span-10 sm:col-span-1 ${isMobile ? "flex justify-between gap-14" : ""}`} data-test-selector={formatTestSelector("div", `${label}${sku}`)}>
    {isMobile && <MobileLabel label={label} />}
    <p className={`font-semibold ${isMobile ? "justify-self-end text-right" : "text-left"} custom-word-break`} data-test-selector={`para${label}${id}`}>
      {typeof content === "string" ? <span dangerouslySetInnerHTML={{ __html: content }} /> : content}
    </p>
    {personalizedContent && personalizedContent.length > 0 && <RenderPersonalizedItems data={personalizedContent} />}
  </div>
);

const MobileLabel = ({ label }: { label: string }) => <p className="w-1/3 mb-0 font-semibold text-left text-gray-600">{label}</p>;

export default ReceiptOrderSummary;

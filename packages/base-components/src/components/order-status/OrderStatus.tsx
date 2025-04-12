"use client";
import { useTranslationMessages } from "@znode/utils/component";
import { Heading } from "../common/heading";
import { INPUT_REGEX } from "@znode/constants/regex";
import Button from "../common/button/Button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { IOrderStatusRequest } from "@znode/types/order-status";
import { ValidationMessage } from "../common/validation-message";
import { useState } from "react";
import { Separator } from "../common/separator";
import { OrderStatusDetails } from "./OrderStatusDetail";
import { IOrderDetails } from "@znode/types/account";
import { getOrderStatus } from "../../http-request/order-status";
import { NoRecordFound } from "../common/no-record-found";

const inputClass = "w-full h-10 mt-2 px-2 py-1 border rounded-inputBorderRadius border-inputColor hover:border-black active:border-black focus:outline-none";
export function OrderStatus() {
  const orderMessages = useTranslationMessages("Orders");
  const commonMessages = useTranslationMessages("Common");
  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState<null | IOrderDetails | object>({});
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IOrderStatusRequest>({ mode: "onChange" });

  const onSubmit = async (orderStatusRequest: IOrderStatusRequest) => {
    try {
      setLoading(true);
      const data = await getOrderStatus(orderStatusRequest);
      setOrderDetail(data);
    } catch (err) {
      setOrderDetail(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pb-3">
      <Heading name={orderMessages("trackYourOrder")} dataTestSelector="hdgTrackOrder" level="h1" showSeparator />
      <div className="mt-1 xs:w-full md:w-1/2 lg:w-2/6 no-print" data-test-selector="divTrackOrder">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2 flex-col">
            {/* order number */}
            <div>
              <label htmlFor="orderNumber" className="font-semibold" data-test-selector="lblOrderNo">
                {orderMessages("orderNumber")}
                <span className="ml-1 font-bold text-errorColor">*</span>
              </label>
              <input
                className={inputClass}
                {...register("orderNumber", {
                  required: orderMessages("requiredOrderNumber"),
                  pattern: { value: INPUT_REGEX.ORDER_NUMBER_REGEX, message: orderMessages("orderNoPatternMessage") },
                })}
                placeholder=""
                id="orderNumber"
                data-test-selector="txtOrderNumber"
              />
              {errors?.orderNumber && <ValidationMessage message={errors?.orderNumber?.message} dataTestSelector="RequiredOrderNumberError" />}
            </div>
            {/* email */}
            <div>
              <label htmlFor="email" className="font-semibold" data-test-selector="lblEmail">
                {commonMessages("email")}
                <span className="ml-1 font-bold text-errorColor">*</span>
              </label>
              <input
                className={inputClass}
                {...register("email", {
                  required: commonMessages("requiredEmailAddress"),
                  pattern: { value: INPUT_REGEX.EMAIL_REGEX, message: commonMessages("emailPatternMessage") },
                })}
                placeholder=""
                id="email"
                data-test-selector="txtEmailAddress"
              />
              {errors?.email && <ValidationMessage message={errors?.email?.message} dataTestSelector="RequiredEmailAddressError" />}
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Button
                htmlType="submit"
                type="primary"
                size="small"
                loading={loading}
                showLoadingText={true}
                loaderColor="currentColor"
                loaderWidth="20px"
                loaderHeight="20px"
                dataTestSelector="btnSubmitRequest"
              >
                {commonMessages("trackOrder")}
              </Button>
              <Button type="secondary" size="small" onClick={() => router.push("/")} dataTestSelector="btnCancel">
                {commonMessages("cancel")}
              </Button>
            </div>
          </div>
        </form>
      </div>
      {!orderDetail ? (
        <>
          <Separator size="xs" customClass="mt-6" />
          <NoRecordFound text={commonMessages("noRecordsFound")} align="left" customClass="-ml-2 -mt-4" />
        </>
      ) : (
        <OrderStatusDetails order={orderDetail as IOrderDetails} />
      )}
    </div>
  );
}

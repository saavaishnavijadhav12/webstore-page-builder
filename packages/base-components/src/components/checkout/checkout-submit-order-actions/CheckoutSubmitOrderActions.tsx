"use client";

import { IAdditionalInstruction, ICheckoutSubmitOrderRequest, IConvertToOrder, IConvertedToOrderResponse, ISubmitOrder } from "@znode/types/checkout";
import { ORDER, ORDER_DATA_TYPE, TARGET_ORDER_DATA_TYPE } from "@znode/constants/order";
import { PAYMENT_STATUS, PAYMENT_SUBTYPE } from "@znode/constants/payment";
import { deleteCookie, getCookie, removeLocalStorageData, setCookie, useTranslationMessages } from "@znode/utils/component";
import { useCheckout, usePayment, useProduct, useToast } from "../../../stores";
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";

import { ADDRESS } from "@znode/constants/address";
import Button from "../../common/button/Button";
import { CART_COOKIE } from "@znode/constants/cookie";
import { IBaseResponse } from "@znode/types/response";
import { IPaymentDetails } from "@znode/types/payment";
import { LoaderComponent } from "../../common/loader-component";
import { PENDING_APPROVAL_STATUS } from "@znode/constants/pending-order";
import { Recaptcha } from "../../common/recaptcha/Recaptcha";
import { STATUSCODE } from "@znode/constants/checkout";
import { create } from "../../..//http-request/cart/create";
import { errorStack } from "@znode/logger/server";
import { getCartNumber } from "../../../http-request";
import { getGuestUserDetails } from "@znode/utils/component";
import { logClient } from "@znode/logger";
import { processOrder } from "../../../http-request/checkout/place-order";
import { submitOrder } from "@znode/agents/order/order-helper";
import { useRouter } from "next/navigation";
import { ERROR_CODE } from "@znode/constants/error";

export function CheckoutSubmitOrderActions({
  setIsDisabled,
  //setIsFullPageLoading,//TODO:
  isDisabled,
  jobName,
  additionalInstruction,
  isAddEditAddressOpen,
  total,
  isFromQuote,
  isApprovalPaymentStatus,
  approvalType,
  enableApprovalRouting,
  orderLimit,
  isPaymentSelected,
  isOABFlagOn,
  recaptchaDetails,
  voucherAmount,
  userDetails,
  isMobileButton = false,
}: Readonly<ICheckoutSubmitOrderRequest>) {
  const checkoutTranslations = useTranslationMessages("Checkout");
  const commonMessages = useTranslationMessages("Common");
  const { error, success } = useToast();
  const { shippingAddressId, shippingOptionId, billingAddressId, paymentSettingId, shippingConstraintCode, setShippingOptionId, setEnterPinCode } = useCheckout();

  const [reVerify, setReVerify] = useState(false);
  const reCaptchaRef = useRef(null);
  const { updateCartCount } = useProduct();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState({ formState: false, type: "" });
  const { payment } = usePayment();

  useEffect(() => {
    if (isFormSubmitted?.formState && reVerify) {
      switch (isFormSubmitted.type) {
        case "PlaceOrder":
          placeOrder();
          break;
        case "PlaceQuote":
          placeQuote();
          break;
        case "SubmitForApproval":
          submitForApproval();
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormSubmitted, reVerify]);

  const handleRecaptchaVerify = async (verified: boolean) => {
    setReVerify(verified);
  };

  const placeQuote = async () => {
    setLoading(true);
    isDisabled = true;
    const cartNumber = getCookie(CART_COOKIE.CART_NUMBER);
    const placedQuoteDetails = await create({
      orderType: ORDER_DATA_TYPE.QUOTE,
      cartNumber: cartNumber,
      targetClassType: TARGET_ORDER_DATA_TYPE.QUOTE,
      jobName: jobName,
      additionalInstruction: additionalInstruction,
    });
    if (placedQuoteDetails && placedQuoteDetails.isSuccess) {
      setShippingOptionId(null);
      setEnterPinCode("");
      updateCartCount(0);
      setLoading(true);
      deleteCookie(CART_COOKIE.CART_NUMBER);
      deleteCookie(CART_COOKIE.CART_ID);
      removeLocalStorageData(ADDRESS.ONETIME_ADDRESS_IDS);
      sessionStorage.setItem("ConvertedClassNumber", placedQuoteDetails?.quoteNumber || "");
      router.push("/quote/receipt");
      return null;
    }
  };

  const handleOrderSubmission = (type: string) => {
    setIsFormSubmitted({ formState: true, type: type });
    setLoading(true);
    if (!reVerify && recaptchaDetails?.isRecaptchaRequiredForCheckout) {
      error(commonMessages("captchaVerificationError"));
      setLoading(false);
      setIsFormSubmitted({ formState: false, type: "" });
      return;
    } else {
      if (recaptchaDetails?.isRecaptchaRequiredForCheckout) {
        setReVerify(false);
        //@ts-expect-error recaptcha library types not defined for reset
        reCaptchaRef && reCaptchaRef?.current && reCaptchaRef.current.reset();
        //@ts-expect-error recaptcha library types not defined for reset
        reCaptchaRef && reCaptchaRef?.current && reCaptchaRef.current.execute();
      } else {
        handleRecaptchaVerify(true);
      }
    }
  };

  const handleAddEditAddressError = (addEditAddressData: { isShippingAddressOpen: boolean; isBillingAddressOpen: boolean }) => {
    if (addEditAddressData?.isBillingAddressOpen) {
      error(checkoutTranslations("pleaseAddSaveBillingAddress"));
    } else {
      error(checkoutTranslations("pleaseAddSaveShippingAddress"));
    }
  };

  const placeOrderResponse = async (submitOrderModel: ISubmitOrder) => {
    let userId = userDetails?.userId;
    if (!userId) {
      const cardNumber = await getCartNumber();
      const guestUserDetails = await getGuestUserDetails(cardNumber);
      userId = guestUserDetails?.guestUserId;
    }

    const additionalInstruction: IAdditionalInstruction = {
      name: submitOrderModel.jobName,
      information: submitOrderModel.additionalInstruction,
    };

    const paymentDetails = {
      configurationSetCode: payment.configurationSetCode,
      paymentSubTypeCode: payment.subTypeCode,
      paymentStatusCode: PAYMENT_STATUS.PENDING,
      paymentName: payment.configurationSetDisplayName,
    } as IPaymentDetails;
    if (payment.subTypeCode?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase()) {
      if (payment.purchaseOrderNumber) paymentDetails.purchaseOrderNumber = payment.purchaseOrderNumber;
      if (payment.purchaseOrderDocumentPath) paymentDetails.purchaseOrderDocumentFilePath = payment.purchaseOrderDocumentPath;
    }

    const convertToOrderRequestModel: IConvertToOrder = {
      userId: userId || 0,
      orderStateId: 0,
      statusCode: STATUSCODE.IN_PROGRESS,
      accountCode: "",
      additionalInstruction: additionalInstruction,
      paymentDetails: paymentDetails,
    };

    convertToOrderRequestModel.paymentDetails = paymentDetails;
    convertToOrderRequestModel.additionalInstruction= additionalInstruction;
    const orderResponse: IConvertedToOrderResponse = await processOrder(convertToOrderRequestModel, String(submitOrderModel.cartNumber), ORDER_DATA_TYPE.ORDER);
    return orderResponse;
  };

  const placeOrder = async () => {
    try {
      //setIsFullPageLoading(true);
      if (isAddEditAddressOpen?.isBillingAddressOpen || isAddEditAddressOpen?.isShippingAddressOpen) {
        handleAddEditAddressError(isAddEditAddressOpen);
        setLoading(false);
        //setIsFullPageLoading(false);
      } else {
        setIsDisabled && setIsDisabled(true);
        const subTypeCode = payment.subTypeCode?.toLowerCase();
        if (!subTypeCode && voucherAmount && total - voucherAmount > 0) {
          setLoading(false);
          error(checkoutTranslations("errorFailedToCreate"));
          setIsDisabled && setIsDisabled(false);
        }
        if (
          (!subTypeCode && (total <= 0 || voucherAmount === total)) ||
          (subTypeCode && subTypeCode === PAYMENT_SUBTYPE.CHARGE_ON_DELIVERY.toLowerCase()) ||
          (subTypeCode && subTypeCode === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase()) ||
          (subTypeCode && subTypeCode === PAYMENT_SUBTYPE.INVOICE_ME.toLowerCase())
        ) {
          setLoading(true);
          const cartNumber = await getCartNumber();
          let orderResponse = {};
          const requestBody = {
            shippingAddressId: shippingAddressId,
            billingAddressId: billingAddressId,
            shippingOptionId: shippingOptionId,
            paymentSettingId: paymentSettingId,
            inHandDate: new Date(),
            shippingConstraintCode: shippingConstraintCode,
            jobName: jobName,
            additionalInstruction: additionalInstruction,
            total: total,
            cartNumber: cartNumber,
          };
          if (cartNumber) {
            orderResponse = await placeOrderResponse(requestBody);
          }
          const order = await submitOrder({ ...requestBody, orderResponse });
          if (order?.isSuccess) {
            setShippingOptionId(null);
            setEnterPinCode("");
            success(checkoutTranslations("placeOrderSuccessfully"));
            updateCartCount(0);
            removeLocalStorageData(ADDRESS.ONETIME_ADDRESS_IDS);
            router.push("/order/receipt");
          } else {
            if (order?.hasError && order?.errorCode === ERROR_CODE.CHECKOUT_ORDER_ERROR) {
              router.push("/cart");
            } else {
              error(checkoutTranslations("errorFailedToCreate"));
            }
            setLoading(false);
          }

          //setIsFullPageLoading(false);
        }
      }
    } catch (error) {
      logClient.error("Error in method - placeOrder " + errorStack(error));
      return { hasError: true } as IBaseResponse;
    }
  };
  const submitForApproval = async () => {
    try {
      if (isAddEditAddressOpen?.isBillingAddressOpen || isAddEditAddressOpen?.isShippingAddressOpen) {
        handleAddEditAddressError(isAddEditAddressOpen);
      } else {
        setIsDisabled && setIsDisabled(true);
        const subTypeCode = payment?.subTypeCode;
        if (
          payment &&
          ((!subTypeCode && total <= 0) ||
            subTypeCode?.toLowerCase() === PAYMENT_SUBTYPE.CHARGE_ON_DELIVERY.toLowerCase() ||
            subTypeCode?.toLowerCase() === PAYMENT_SUBTYPE.INVOICE_ME.toLowerCase() ||
            subTypeCode?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase())
        ) {
          const paymentDetails = {
            configurationSetCode: payment.configurationSetCode,
            paymentSubTypeCode: subTypeCode,
            paymentStatusCode: PAYMENT_STATUS.PENDING,
            paymentName: payment.configurationSetDisplayName,
          } as IPaymentDetails;
          if (subTypeCode?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() && payment.purchaseOrderNumber)
            paymentDetails.purchaseOrderNumber = payment.purchaseOrderNumber;
          if (subTypeCode?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() && payment.purchaseOrderDocumentPath)
            paymentDetails.purchaseOrderDocumentFilePath = payment.purchaseOrderDocumentPath;
          setLoading(true);
          const cartNumber = await getCartNumber();
          if (cartNumber) {
            const convertToOrderRequestModel: IConvertToOrder = {
              userId: userDetails?.userId || 0,
              targetClassType: "ApprovalRoutings",
              paymentDetails: paymentDetails,
            };
            const orderResponse: IConvertedToOrderResponse = await processOrder(convertToOrderRequestModel, cartNumber, ORDER_DATA_TYPE.ORDER);
            setCookie(ORDER.USER_PENDING_ORDER_RECEIPT_ORDER_ID, String(orderResponse?.orderNumber));
            if (orderResponse) {
              if (orderResponse?.isSuccess) {
                updateCartCount(0);
                removeLocalStorageData(ADDRESS.ONETIME_ADDRESS_IDS);
                success(checkoutTranslations("successPlacedOrderForApproval"));
                router.push("/pending-order/receipt");
              } else {
                setLoading(false);
                error(checkoutTranslations("errorFailedToCreate"));
                return null;
              }
            } else {
              setLoading(false);
              error(checkoutTranslations("errorFailedToCreate"));
              return null;
            }
          }
        }
      }
    } catch (error) {
      logClient.error("Error in method - submitForApproval " + errorStack(error));
      return { hasError: true } as IBaseResponse;
    }
  };

  const requiresApproval =
    enableApprovalRouting &&
    ((approvalType === PENDING_APPROVAL_STATUS.PAYMENT && isApprovalPaymentStatus) || approvalType === PENDING_APPROVAL_STATUS.STORE) &&
    total >= (orderLimit || 0);

  return (
    <>
      <LoaderComponent isLoading={loading} overlay={true} />
      <div className="py-2 text-right xs:text-left">
        {isFromQuote ? (
          <Button
            type="primary"
            size="small"
            onClick={() => handleOrderSubmission("PlaceQuote")}
            className="w-full"
            disabled={!(shippingOptionId && !isDisabled)}
            dataTestSelector={`${isMobileButton ? "btnMobilePlaceQuote" : "btnPlaceQuote"}`}
            ariaLabel="Submit Quote button"
          >
            {checkoutTranslations("submitQuote")}
          </Button>
        ) :( isOABFlagOn || requiresApproval) && userDetails?.userId ? (
          <Button
            type="primary"
            size="small"
            onClick={() => handleOrderSubmission("SubmitForApproval")}
            className="w-full"
            disabled={!shippingOptionId || isDisabled || (!isPaymentSelected && total > 0 && voucherAmount !== total)}
            dataTestSelector={`${isMobileButton ? "btnMobileSubmitForApproval" : "btnSubmitForApproval"}`}
            ariaLabel="Submit For Approval button"
          >
            {checkoutTranslations("submitForApproval")}
          </Button>
        ) : (
          <Button
            type="primary"
            size="small"
            onClick={() => handleOrderSubmission("PlaceOrder")}
            className="w-full"
            disabled={!shippingOptionId || isDisabled || (!isPaymentSelected && total > 0 && voucherAmount !== total)}
            dataTestSelector={`${isMobileButton ? "btnMobilePlaceOrder" : "btnPlaceOrder"}`}
            ariaLabel="Place Order button"
          >
            {checkoutTranslations("placeOrder")}
          </Button>
        )}
        {recaptchaDetails?.isRecaptchaRequiredForCheckout && recaptchaDetails.siteKey && recaptchaDetails.siteKey !== "" && (
          <Recaptcha
            onVerify={handleRecaptchaVerify}
            recaptchaRef={reCaptchaRef}
            siteKey={recaptchaDetails.siteKey}
            secretKey={recaptchaDetails.secretKey}
            dataTestSelector="divCheckoutRecaptcha"
          />
        )}{" "}
      </div>
    </>
  );
}

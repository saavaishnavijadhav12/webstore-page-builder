/* eslint-disable max-lines-per-function */
import { DISCOUNT_TYPE, STATUSCODE } from "@znode/constants/checkout";
import { IAdditionalInstruction, IConvertToOrder, IConvertedToOrderResponse, IPaymentOptionsProps, ISubmitOrder, ISubmitPaymentModel } from "@znode/types/checkout";
import { ICardDetails, IPaymentAddress, IPaymentConfigurationSetDetails, IPaymentOption, IPaymentPluginRequest, IPluginErrorResponse } from "@znode/types/payment";
import { ORDER, ORDER_DATA_TYPE, ORDER_RECEIPT, TARGET_ORDER_DATA_TYPE } from "@znode/constants/order";
import { PAYMENT_PLUGIN, PAYMENT_SUBTYPE } from "@znode/constants/payment";
import { clientToken, create, generateFinalizeNumber, getAddressDetailsById, getCartNumber, getPaymentConfigurationsByCode, processOrder } from "../../../../http-request";
import { copyOrderDetails, getCartSummary, updateOrderStatus } from "../../../../http-request";
import { deleteCookie, getCookie, getGuestUserDetails, removeLocalStorageData, setCookie, useTranslationMessages } from "@znode/utils/component";
import { useCheckout, useModal, usePayment, useToast, useUser } from "../../../../stores";
import { useEffect, useState } from "react";

import { ADDRESS } from "@znode/constants/address";
import Button from "../../../common/button/Button";
import { CART_COOKIE } from "@znode/constants/cookie";
import { Heading } from "../../../common/heading";
import { IBaseResponse } from "@znode/types/response";
import { IPaymentDetails } from "@znode/types/payment";
import Input from "../../../common/input/Input";
import { LoaderComponent } from "../../../common/loader-component";
import { Modal } from "../../../common/modal";
import { PaymentPlugin } from "../payment-plugin/PaymentPlugin";
import Promo from "../../../common/promotions/Promo";
import PurchaseOrder from "../payment-internal/PurchaseOrder";
import { QUOTE_STATUS } from "@znode/constants/quote";
import { checkStoreApprovalSettings } from "../../../../http-request";
import { errorStack } from "@znode/logger/server";
//TO: DO : Warlords - Remove this and use hook
import { getSavedUserSessionCallForClient } from "@znode/utils/common";
import { logClient } from "@znode/logger";
import { mapPaymentAddress } from "@znode/agents/order/order-helper";
import { useProduct } from "../../../../stores";
import { useRouter } from "next/navigation";
import { IUpdateOrderPayment } from "@znode/types/order";

export function PaymentOptions({
  paymentOptions,
  total,
  jobName,
  additionalInstruction,
  setPaymentProcessing,
  setIsDisabled,
  isFromQuote = false,
  quoteNumber,
  currencyCode,
  setIsPaymentSelected,
  isOfflinePayment,
  isOABFlagOn,
  approvalType,
  enableApprovalRouting,
  isApprovalPaymentStatus,
  setIsBillingAddressOptional,
  voucherAmount,
}: IPaymentOptionsProps) {
  const [configurationSet, setConfigurationSet] = useState<IPaymentConfigurationSetDetails>();
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<IPaymentOption>();
  const [initiatePlaceOrderAction, setInitiatePlaceOrderAction] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<IPluginErrorResponse>({} as IPluginErrorResponse);
  const [initiateCancelAction, setInitiateCancelAction] = useState<boolean>(false);
  const [loadPluginUI, setLoadPluginUI] = useState<boolean>(false);
  const [showPayAndSubmit, setShowPayAndSubmit] = useState<boolean>(false);
  const [orderTotal, setOrderTotal] = useState<number>();
  const [paymentClientToken, setPaymentClientToken] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<IPaymentPluginRequest>({} as IPaymentPluginRequest);
  const [isDisabledConvertQuote, setIsDisabledConvertQuote] = useState<boolean>(false);
  const [isPaymentOptionSelected, setIsPaymentOptionSelected] = useState<boolean>(false);
  //TODO - Warlords - Payment plugin do not have fixed response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentClientResponse, setPaymentClientResponse] = useState<any>();
  const paymentTranslations = useTranslationMessages("Payment");
  const checkoutTranslations = useTranslationMessages("Checkout");
  const { shippingOptionId, billingAddressId, shippingAddressId, shippingConstraintCode } = useCheckout();
  const { user, loadUser } = useUser();
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { error, success, isActiveToast } = useToast();
  const router = useRouter();
  const { payment, setPaymentDetails } = usePayment();
  const { updateCartCount } = useProduct();

  useEffect(() => {
    if (!user?.userId) loadUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    if (initiatePlaceOrderAction) setPaymentProcessing(true);
    if (paymentClientResponse && isOfflinePayment && payment.invoiceOrderNumber) createOnlinePayment(payment.invoiceOrderNumber, total);
    if (paymentClientResponse && !isOfflinePayment && !isFromQuote) createOnlinePaymentOrder();
    if (paymentClientResponse && isFromQuote) submitOrder();
    if (initiateCancelAction) {
      closeModal();
      setInitiateCancelAction(false);
    }
    if (errorResponse.hasError) closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiatePlaceOrderAction, paymentClientResponse, initiateCancelAction, errorResponse]);

  const createOrder = async (paymentRequestModel : IUpdateOrderPayment ) => {
    const cartNumber = await getCartNumber();
    let orderResponse;
    const requestBody = {
      shippingAddressId: shippingAddressId,
      billingAddressId: billingAddressId,
      shippingOptionId: shippingOptionId,
      shippingConstraintCode: shippingConstraintCode,
      jobName: jobName,
      additionalInstruction: additionalInstruction,
      total: orderTotal,
      cartNumber: cartNumber,
      paymentDetails: {
        configurationSetCode: configurationSet?.configurationSetCode,
        paymentSubTypeCode: paymentRequestModel?.paymentDetails?.paymentSubTypeCode,
        paymentName: configurationSet?.configurationSetDisplayName,
        paymentTransactionToken: paymentRequestModel?.paymentDetails?.paymentTransactionToken,
        externalTransactionId: paymentRequestModel?.paymentDetails?.externalTransactionId,
        paymentStatusCode : paymentRequestModel?.paymentDetails?.paymentStatusCode,
      } as IPaymentDetails,
    };
    if (cartNumber) {
      orderResponse = await placeOrderResponse(requestBody as ISubmitOrder);
    }
    return orderResponse;
  };

  const getFinalizedOrderNumber = async (cartNumber: string) => {
    const finalizeNumber = await generateFinalizeNumber(cartNumber);
    return finalizeNumber?.finalClassNumber ?? null;
  };

  const placeOrderResponse = async (submitOrderModel: ISubmitOrder) => {
    //TO: DO : Warlords- Remove this and use hook
    const userModel = await getSavedUserSessionCallForClient();
    let userId = userModel?.userId;
    if (!userId) {
      const cartNumber = await getCartNumber();
      const guestUserDetails = await getGuestUserDetails(cartNumber);
      userId = guestUserDetails?.guestUserId;
    }
    const additionalInstruction: IAdditionalInstruction = {
      name: submitOrderModel.jobName ?? "",
      information: submitOrderModel.additionalInstruction ?? "",
    };
    const convertToOrderRequestModel: IConvertToOrder = {
      userId: userId ?? 0,
      orderStateId: 0,
      statusCode: STATUSCODE.IN_PROGRESS,
      accountCode: "",
      additionalInstruction: additionalInstruction ?? "",
    };
    convertToOrderRequestModel.paymentDetails = submitOrderModel.paymentDetails;
    const orderResponse: IConvertedToOrderResponse = await processOrder(convertToOrderRequestModel, String(submitOrderModel.cartNumber), ORDER_DATA_TYPE.ORDER);
    return orderResponse;
  };

  const createOnlinePaymentOrder = async () => {
    closeModal();
    setPaymentProcessing(true);
    if (!isOfflinePayment) {
      const cartNumber = await getCartNumber();
      const finalClassNumber = await getFinalizedOrderNumber(cartNumber);
      if(finalClassNumber) {
        const paymentResponse = await createOnlinePayment(String(finalClassNumber), orderTotal ?? 0);
        if(paymentResponse && paymentResponse?.paymentDetails?.paymentTransactionToken) {
          const order = await createOrder(paymentResponse);
          if (order?.isSuccess) {
            setCookie(ORDER.USER_ORDER_RECEIPT_ORDER_ID, String(order?.orderNumber));
            removeLocalStorageData(ADDRESS.ONETIME_ADDRESS_IDS);
            setPaymentProcessing(false);
            success(checkoutTranslations("placeOrderSuccessfully"));
            deleteCookie(CART_COOKIE.CART_NUMBER);
            deleteCookie(CART_COOKIE.CART_ID);
            updateCartCount(0);
            router.push("/order/receipt");
          } else {
            error(checkoutTranslations("errorFailedToCreate"));
            setPaymentProcessing(false);
          }
        }
        else {
          error(checkoutTranslations("errorFailedToCreate"));
          setPaymentProcessing(false);
        }
      }
      else {
        error(checkoutTranslations("errorFailedToCreate"));
        setPaymentProcessing(false);
      }
    }
  };

  const createOnlinePayment = async (orderNumber: string, total: number) => {
    if (isOfflinePayment) closeModal();
    let cardDetails = {};
    if (configurationSet?.pluginName && configurationSet?.pluginName?.toLowerCase() !== PAYMENT_PLUGIN.SPREEDLY.toLowerCase()) {
      cardDetails = {
        cardExpirationMonth: Number(paymentClientResponse.cardDetails?.cardExpirationMonth),
        cardExpirationYear: Number(paymentClientResponse.cardDetails?.cardExpirationYear),
        cardLastFourDigit: paymentClientResponse.cardDetails?.cardLastFourDigit,
        cardHolderFirstName: paymentClientResponse.cardDetails?.cardHolderFirstName,
      } as ICardDetails;
    }
    const submitPaymentModel = {
      paymentSubTypeCode: configurationSet?.subType ?? "",
      configurationSetCode: configurationSet?.configurationSetCode ?? "",
      cardDetails: cardDetails,
      isCapture: configurationSet?.isCapture ?? false,
      isSaveCreditCard: false,
      paymentPluginName: configurationSet?.pluginName ?? "",
      orderNumber: orderNumber,
      total: total,
      isOfflinePayment: isOfflinePayment,
      billingAddress: paymentRequest.billingAddress,
    } as ISubmitPaymentModel;
    if (submitPaymentModel.paymentSubTypeCode.toLowerCase() === PAYMENT_SUBTYPE.CREDIT_CARD.toLowerCase())
      submitPaymentModel.paymentMethodToken = paymentClientResponse.paymentToken ?? "";
    else if (submitPaymentModel.paymentSubTypeCode.toLowerCase() === PAYMENT_SUBTYPE.ACH.toLowerCase())
      submitPaymentModel.paymentDetailsToken = paymentClientResponse.paymentToken ?? "";
    const paymentRequestModel = await create(submitPaymentModel);
    return paymentRequestModel;
  };

  useEffect(() => {
    if (document) {
      //Exposing PM_URI
      const script = document.createElement("script");
      script.src = String(process.env.NEXT_PUBLIC_PAYMENT_MANAGER_URL);
      script.async = true;
      document.head.append(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);
  const getConfigurationSet = async (configurationSetCode: string) => {
    const configurationSet: IPaymentConfigurationSetDetails = await getPaymentConfigurationsByCode({ configurationSetCode: configurationSetCode });
    return configurationSet;
  };
  const createPaymentRequest = async () => {
    if (!isOfflinePayment) {
      const cartNumber = await getCartNumber();
      const cartSummaryData = await getCartSummary(cartNumber);
      setOrderTotal(
        cartSummaryData.total && voucherAmount && voucherAmount > 0 && cartSummaryData.total !== voucherAmount ? cartSummaryData.total - voucherAmount : cartSummaryData.total
      );
    }
    const userId = user?.userId ?? 0;
    const isRegisteredUser: boolean = userId > 0;
    const shippingAddress = {} as IPaymentAddress;
    const billingAddress = {} as IPaymentAddress;
    const paymentRequest = {
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      isGuestUser: !isRegisteredUser,
      paymentMethodType: configurationSet?.subType,
      total: isOfflinePayment ? String(total) : orderTotal,
    } as IPaymentPluginRequest;
    await setAddressDetailsForPayment(paymentRequest);
    return paymentRequest;
  };

  const handlePayAndSubmit = async () => {
    setLoading(true);
    if (configurationSet) {
      const paymentRequest = await createPaymentRequest();
      if (paymentRequest.paymentMethodType.toLowerCase() === PAYMENT_SUBTYPE.CREDIT_CARD.toLowerCase()) {
        const clientTokenResponse = await clientToken({ configurationSetCode: configurationSet.configurationSetCode, customerGuid: "" });
        setPaymentClientToken(clientTokenResponse.paymentGatewayToken);
      }
      setPaymentRequest(paymentRequest);
      setLoadPluginUI(true);
      setLoading(false);
      openModal(configurationSet?.pluginName);
    }
  };

  const handleInputChange = async (paymentOption: IPaymentOption) => {
    setIsDisabled && setIsDisabled(true);
    setIsDisabledConvertQuote && setIsDisabledConvertQuote(true);
    setLoadPluginUI(false);
    setSelectedPaymentOption(paymentOption);
    if (paymentOption.paymentCode) {
      const configurationSet = await getConfigurationSet(paymentOption.paymentCode);
      setIsBillingAddressOptional && setIsBillingAddressOptional(configurationSet?.isBillingAddressOptional ?? false);
      if (!isFromQuote && isOABFlagOn) {
        isOABFlagOn(configurationSet.isOAB || false);
      }
      if (!shippingOptionId && !isFromQuote) {
        setShowPayAndSubmit(false);
        setPaymentDetails(null, null, null, false);
        setSelectedPaymentOption({} as IPaymentOption);
        setConfigurationSet({} as IPaymentConfigurationSetDetails);
        setIsPaymentSelected && setIsPaymentSelected(false);
        setIsPaymentOptionSelected && setIsPaymentOptionSelected(false);
        if (!isActiveToast("selectShippingOption")) error(checkoutTranslations("selectShippingOption"), { toastId: "selectShippingOption" });
        return;
      }
      setConfigurationSet(configurationSet);
      setIsPaymentSelected && setIsPaymentSelected(true);
      setIsPaymentOptionSelected && setIsPaymentOptionSelected(true);
      if (enableApprovalRouting && approvalType === "Payment") {
        const isApprovalFlagOn = await checkStoreApprovalSettings({ paymentCode: paymentOption.paymentCode });
        if (!isFromQuote && isApprovalPaymentStatus) {
          isApprovalPaymentStatus(isApprovalFlagOn);
        }
      }
      setPaymentDetails(configurationSet.subType, configurationSet.configurationSetCode, configurationSet.configurationSetDisplayName, isOfflinePayment);
      if (
        (isOfflinePayment && configurationSet) ||
        (isFromQuote &&
          configurationSet &&
          configurationSet.subType.toLowerCase() !== PAYMENT_SUBTYPE.CHARGE_ON_DELIVERY.toLowerCase() &&
          configurationSet.subType.toLowerCase() !== PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() &&
          configurationSet.subType.toLowerCase() !== PAYMENT_SUBTYPE.INVOICE_ME.toLowerCase())
      ) {
        const paymentRequest = await createPaymentRequest();
        if (configurationSet.subType.toLowerCase() === PAYMENT_SUBTYPE.CREDIT_CARD.toLowerCase()) {
          const clientTokenResponse = await clientToken({ configurationSetCode: configurationSet.configurationSetCode, customerGuid: "" });
          setPaymentClientToken(clientTokenResponse.paymentGatewayToken);
        }
        paymentRequest.paymentMethodType = configurationSet?.subType;
        setPaymentRequest(paymentRequest);
        setLoadPluginUI(true);
      } else {
        const paymentSubType = configurationSet.subType;
        if (
          paymentSubType.toLowerCase() === PAYMENT_SUBTYPE.CHARGE_ON_DELIVERY.toLowerCase() ||
          paymentSubType.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() ||
          paymentSubType.toLowerCase() === PAYMENT_SUBTYPE.INVOICE_ME.toLowerCase()
        ) {
          setShowPayAndSubmit(false);
          if (paymentSubType.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase()) {
            setIsDisabled && setIsDisabled(true);
            setIsDisabledConvertQuote && setIsDisabledConvertQuote(true);
          } else {
            setIsDisabled && setIsDisabled(false);
            setIsDisabledConvertQuote && setIsDisabledConvertQuote(false);
          }
        } else {
          setShowPayAndSubmit(true);
          setIsDisabled && setIsDisabled(true);
          setIsDisabledConvertQuote && setIsDisabledConvertQuote(true);
        }
      }
    }
  };

  const setAddressDetailsForPayment = async (paymentRequest: IPaymentPluginRequest) => {
    if (billingAddressId) {
      const checkoutBillingAddress = await getAddressDetailsById(billingAddressId);
      const billingAddress = await mapPaymentAddress(checkoutBillingAddress);
      if (billingAddress) paymentRequest.billingAddress = billingAddress;
    }
    if (shippingAddressId) {
      const checkoutShippingAddress = await getAddressDetailsById(shippingAddressId);
      const shippingAddress = await mapPaymentAddress(checkoutShippingAddress);
      if (shippingAddressId) paymentRequest.shippingAddress = shippingAddress;
    }
  };
  useEffect(() => {
    if (total <= 0 || voucherAmount === total) {
      setShowPayAndSubmit(false);
      setIsPaymentSelected && setIsPaymentSelected(false);
      setPaymentDetails(null, null, null, false);
      setConfigurationSet({} as IPaymentConfigurationSetDetails);
      setSelectedPaymentOption({} as IPaymentOption);
    }
  }, [total, voucherAmount, setPaymentDetails, setIsPaymentSelected]);
  const renderPaymentMethods = (paymentConfigurationSets: IPaymentOption[]) => {
    if (paymentConfigurationSets.length > 0) {
      return paymentConfigurationSets?.map((paymentConfigurationSet: IPaymentOption) => {
        return (
          <div className="flex items-center" data-test-selector={`divPaymentOptions${paymentConfigurationSet?.paymentCode}`} key={paymentConfigurationSet?.paymentId}>
            <Input
              type="radio"
              className={total <= 0 || voucherAmount === total ? "h-4 form-radio xs:w-4 text-gray-500" : "h-4 form-radio xs:w-4 accent-accentColor"}
              disabled={total <= 0 || voucherAmount === total}
              id={`${paymentConfigurationSet?.paymentCode}-${paymentConfigurationSet?.paymentId}`}
              checked={total > 0 && String(paymentConfigurationSet.paymentCode) === selectedPaymentOption?.paymentCode}
              dataTestSelector={`txt${paymentConfigurationSet?.paymentCode}`}
              onChange={() => handleInputChange(paymentConfigurationSet)}
              ariaLabel="payment method"
            />
            <label
              className={total <= 0 || voucherAmount === total ? "font-normal ml-4 text-gray-500" : "font-normal ml-4 cursor-pointer"}
              htmlFor={`${paymentConfigurationSet?.paymentCode}-${paymentConfigurationSet?.paymentId}`}
              data-test-selector={`lblPayment${paymentConfigurationSet?.paymentCode}`}
            >
              {paymentConfigurationSet?.paymentName}
            </label>
          </div>
        );
      });
    }
  };

  const handleError = () => {
    setLoading(false);
    error(checkoutTranslations("unableToPlaceOrder"));
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      const existingCookie = getCookie(CART_COOKIE.COPIED_CART_NUMBER);
      // Check if the existing cookie is either non-existent or has an empty value
      if (!existingCookie || existingCookie === "undefined" || existingCookie === null || existingCookie.trim() === "") {
        const copyData = await copyOrderDetails({ orderType: ORDER_DATA_TYPE.QUOTE, orderNumber: quoteNumber ?? "" });
        setCookie("CopiedCartNumber", copyData.copiedQuoteNumber || "");
      }
      const userModel = await getSavedUserSessionCallForClient();
      const convertToOrderRequestModel: IConvertToOrder = {
        userId: userModel?.userId || 0,
        targetClassType: TARGET_ORDER_DATA_TYPE.ORDER,
      };
      const paymentDetails = {
        paymentSubTypeCode: selectedPaymentOption?.paymentCode || "",
        configurationSetCode: configurationSet?.configurationSetCode || "",
        paymentName: configurationSet?.configurationSetDisplayName,
      } as IPaymentDetails;
      if (configurationSet?.subType?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() && payment.purchaseOrderNumber)
        paymentDetails.purchaseOrderNumber = payment.purchaseOrderNumber;
      if (configurationSet?.subType?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() && payment.purchaseOrderDocumentPath)
        paymentDetails.purchaseOrderDocumentFilePath = payment.purchaseOrderDocumentPath;
      convertToOrderRequestModel.paymentDetails = paymentDetails;
      const cartNumber = getCookie("CopiedCartNumber");
      if (  configurationSet?.subType?.toLowerCase() !== PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() &&
            configurationSet?.subType?.toLowerCase() !== PAYMENT_SUBTYPE.CHARGE_ON_DELIVERY.toLowerCase() &&
            configurationSet?.subType?.toLowerCase() !== PAYMENT_SUBTYPE.INVOICE_ME.toLowerCase()
          ) {
            const finalClassNumber = await getFinalizedOrderNumber(String(cartNumber));
            if(finalClassNumber)
            {
              const paymentResponse = await createOnlinePayment(String(finalClassNumber), total ?? 0);
              if(paymentResponse)
              {
                convertToOrderRequestModel.paymentDetails.externalTransactionId = paymentResponse?.paymentDetails?.externalTransactionId;
                convertToOrderRequestModel.paymentDetails.paymentStatusCode = paymentResponse?.paymentDetails?.paymentStatusCode;
                convertToOrderRequestModel.paymentDetails.paymentTransactionToken = paymentResponse?.paymentDetails?.paymentTransactionToken;
                convertToOrderRequestModel.paymentDetails.paymentSubTypeCode = paymentResponse?.paymentDetails?.paymentSubTypeCode;
                const orderResponse = await processOrder(convertToOrderRequestModel, cartNumber || "", ORDER_DATA_TYPE.QUOTE);
                if(orderResponse?.isSuccess && orderResponse?.orderNumber)
                {
                  success(checkoutTranslations("placeOrderSuccessfully"));
                  closeModal();
                  await updateOrderStatus({ orderType: ORDER_DATA_TYPE.QUOTE, orderNumber: quoteNumber || "", status: QUOTE_STATUS.QUOTE_STATUS_APPROVED });
                  setLoading(false);
                  setCookie(ORDER_RECEIPT.USER_ORDER_RECEIPT_ORDER_ID, orderResponse.orderNumber.toString());
                  deleteCookie(CART_COOKIE.CART_NUMBER);
                  deleteCookie(CART_COOKIE.COPIED_CART_NUMBER);
                  router.push("/order/receipt");
                }
                else {
                  handleError();
                }
              }
              else {
                handleError();
              }
            }
            else {
              handleError();
            }
          }
      else {
        handleError();
      }
    } catch (error) {
      logClient.error("Error in method - submitForApproval " + errorStack(error));
      return { hasError: true } as IBaseResponse;
    }
  };

  return (
    <>
      <LoaderComponent isLoading={loading} overlay={true} />
      <div className="xs:w-full" data-test-selector="divPaymentContainer">
        <Heading level="h2" customClass="uppercase" name={paymentTranslations("paymentMethod")} dataTestSelector="hdgPaymentMethod" showSeparator />
      </div>
      {paymentOptions && (
        <div className="mt-3 xs:w-full">
          {!isFromQuote && (
            <div className="mb-3">
              <Promo type={DISCOUNT_TYPE.GIFT_CARD} currencyCode={currencyCode} />
            </div>
          )}
          <Heading customClass="uppercase" level="h2" name={paymentTranslations("paymentType")} dataTestSelector="hdgPaymentType" showSeparator />
          <div className="space-y-1.5">{paymentOptions && renderPaymentMethods(paymentOptions)}</div>
        </div>
      )}
      {showPayAndSubmit && !isOfflinePayment && !isFromQuote && (
        <Button
          htmlType="submit"
          size="small"
          onClick={() => handlePayAndSubmit()}
          type="primary"
          className="mt-10"
          dataTestSelector="btnPayAndSubmit"
          ariaLabel="pay and submit button"
          disabled={!shippingOptionId}
        >
          {paymentTranslations("payAndSubmit")}
        </Button>
      )}
      {loadPluginUI && (
        <Modal modalId={String(configurationSet?.pluginName)} maxHeight="xl" size="4xl">
          <PaymentPlugin
            {...{
              pluginScript: configurationSet?.scriptPath ?? "",
              pluginName: configurationSet?.pluginName ?? "",
              clientToken: paymentClientToken ?? "",
              setInitiatePlaceOrderAction: setInitiatePlaceOrderAction,
              setInitiateCancelAction: setInitiateCancelAction,
              setErrorResponse: setErrorResponse,
              setClientResponse: setPaymentClientResponse,
              paymentRequest: paymentRequest,
            }}
          ></PaymentPlugin>
        </Modal>
      )}
      {loadPluginUI && isOfflinePayment && (
        <Modal modalId={String(configurationSet?.pluginName)} maxHeight="xl" size="4xl">
          <PaymentPlugin
            {...{
              pluginScript: configurationSet?.scriptPath ?? "",
              pluginName: configurationSet?.pluginName ?? "",
              clientToken: paymentClientToken ?? "",
              setInitiatePlaceOrderAction: setInitiatePlaceOrderAction,
              setInitiateCancelAction: setInitiateCancelAction,
              setErrorResponse: setErrorResponse,
              setClientResponse: setPaymentClientResponse,
              paymentRequest: paymentRequest,
            }}
          ></PaymentPlugin>
        </Modal>
      )}
      {(loadPluginUI && isOfflinePayment) ||
        (loadPluginUI && isFromQuote && (
          <PaymentPlugin
            {...{
              pluginScript: configurationSet?.scriptPath ?? "",
              pluginName: configurationSet?.pluginName ?? "",
              clientToken: paymentClientToken ?? "",
              setInitiatePlaceOrderAction: setInitiatePlaceOrderAction,
              setInitiateCancelAction: setInitiateCancelAction,
              setErrorResponse: setErrorResponse,
              setClientResponse: setPaymentClientResponse,
              paymentRequest: paymentRequest,
            }}
          ></PaymentPlugin>
        ))}
      {configurationSet?.subType && configurationSet?.subType?.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() && (
        <div>
          <PurchaseOrder
            configurationSet={configurationSet}
            poDocEnabled={configurationSet.enablePODocumentUpload}
            poDocRequired={false}
            setIsDisabled={setIsDisabled}
            setIsDisabledConvertQuote={setIsDisabledConvertQuote}
          />
        </div>
      )}
      {isFromQuote &&
        ((configurationSet && !configurationSet.subType && total <= 0) ||
          configurationSet?.subType.toLowerCase() === PAYMENT_SUBTYPE.CHARGE_ON_DELIVERY.toLowerCase() ||
          configurationSet?.subType.toLowerCase() === PAYMENT_SUBTYPE.PURCHASE_ORDER.toLowerCase() ||
          configurationSet?.subType.toLowerCase() === PAYMENT_SUBTYPE.INVOICE_ME.toLowerCase()) && (
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => {
                submitOrder();
              }}
              type="primary"
              size="small"
              dataTestSelector="btnPlaceOrder"
              ariaLabel="place order button"
              disabled={isDisabledConvertQuote || (!isPaymentOptionSelected && total > 0)}
            >
              {checkoutTranslations("placeOrder")}
            </Button>
          </div>
        )}
    </>
  );
}



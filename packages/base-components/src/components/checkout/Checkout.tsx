"use client";

import { AddressWrapper, getUserAddress } from "../address";
import { IShippingOption, IShippingRequest } from "@znode/types/shipping";
import { useCartDetails, useCheckout, useModal } from "../../stores";
import { useEffect, useState } from "react";

import { AdditionalInformation } from "./additional-information/AdditionalInformation";
import { CartReview } from "./cart-review/CartReview";
import { CheckoutSubmitOrderActions } from "./checkout-submit-order-actions/CheckoutSubmitOrderActions";
import { DISCOUNT_TYPE } from "@znode/constants/checkout";
import { Heading } from "../common/heading";
import { IAddressList } from "@znode/types/address";
import { ICartSettings } from "@znode/types/cart";
import { ICheckoutRecaptcha } from "@znode/types/common";
import { IPaymentOption } from "@znode/types/payment";
import { IUser } from "@znode/types/user";
import Link from "next/link";
import LoaderComponent from "../common/loader-component/LoaderComponent";
import { Modal } from "../common/modal";
import PaymentApplicationLoader from "../common/loader-component/PaymentApplicationLoader";
import { PaymentOptions } from "./payment/payment-options/PaymentOptions";
import Promo from "../common/promotions/Promo";
import { ShippingConstraint } from "./shipping/ShippingConstraint";
import { ShippingOptions } from "./shipping/ShippingOptions";
import SignupWrapper from "./signup-modal/SignupWrapper";
import { getCart } from "@znode/agents/cart/cart-helper";
import { getCartNumber } from "../../http-request/cart/cart-number";
import { getCheckoutGuestUserDetails } from "@znode/agents/checkout/checkout-helper";
import { getShippingOptions } from "../../http-request/checkout/shipping-options";
import { updateAddressIds } from "../../http-request/address/address";
import { useTranslationMessages } from "@znode/utils/component";
import { IGeneralSetting } from "@znode/types/general-setting";

interface ICheckoutData {
  isFromQuote?: boolean;
  paymentOptions?: IPaymentOption[];
  enableShippingAddressSuggestion: boolean;
  approvalType?: string;
  enableApprovalRouting?: boolean;
  orderLimit?: number;
  recaptchaDetails?: ICheckoutRecaptcha;
  loginToSeePriceAndInventory?: boolean;
  userDetails?: IUser | null;
  checkoutPortalData?: ICartSettings;
  generalSetting: IGeneralSetting;
}

export function Checkout({
  isFromQuote = false,
  paymentOptions,
  enableShippingAddressSuggestion,
  approvalType,
  enableApprovalRouting,
  orderLimit,
  recaptchaDetails,
  loginToSeePriceAndInventory,
  userDetails,
  checkoutPortalData,
  generalSetting,
}: ICheckoutData) {
  const addressTranslations = useTranslationMessages("Address");
  const checkoutTranslations = useTranslationMessages("Checkout");
  const { refreshCartSummary } = useCartDetails();
  const { openModal } = useModal();

  const isUser = !!userDetails?.userId;
  const { shippingOptionId, orderSummaryData } = useCheckout();

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutSettings, setCheckoutSettings] = useState<ICartSettings>();
  const [isShippingOptionsUnavailable, setIsShippingOptionsUnavailable] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<IShippingOption[] | null>([]);
  const [isResetForm, setIsResetForm] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<boolean>(false);
  const [shippingConstraintCode, setShippingConstraintCode] = useState<string>("");
  const [inHandDate, setInHandDate] = useState<string>("");
  const [addressId, setAddressId] = useState<number>(0);
  const [jobName, setJobName] = useState<string>("");
  const [additionalInstruction, setAdditionalInstruction] = useState<string>("");
  const [isApprovalPaymentStatus, setIsApprovalPaymentStatus] = useState<boolean>(false);
  const [isPaymentLoading] = useState<boolean>(false);
  const [resetAddress, setResetAddress] = useState<boolean>(false);
  const [isPaymentSelected, setIsPaymentSelected] = useState<boolean>(false);
  const [isOABFlagOn, setIsOABFlagOn] = useState<boolean>(false);
  const [isShippingLoader, setIsShippingLoader] = useState<boolean>(false);
  const [addressInfo, setAddressInfo] = useState<IAddressList>({
    addressList: [],
    isGuestUser: true,
  });
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [shippingPinCode, setShippingPinCode] = useState<string>("");
  const [additionalError, setAdditionalError] = useState<string>("");
  const [jobError, setJobError] = useState<string>("");
  const [isBillingAddressOptional, setIsBillingAddressOptional] = useState<boolean>(false);

  useEffect(() => {
    if (loginToSeePriceAndInventory && loginToSeePriceAndInventory === true && !isUser) {
      window.location.href = "/cart";
    }
  }, [loginToSeePriceAndInventory, isUser]);

  const getReorderAddressDetails = async () => {
    setAddressLoading(true);
    const userId: number = userDetails?.userId ?? 0;
    const cardNumber = await getCartNumber();
    const cartModel = await getCart(cardNumber ?? "");
    const userAddress = await getUserAddress(userId ?? 0, true, "", 0, 0, false, cartModel);
    setAddressInfo(userAddress);
    setAddressLoading(false);
  };

  //TO DO if Address form is open then do not allow user to perform and actions.
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setIsDisabled] = useState(false);
  const [addEditAddressOpen, setAddEditAddressOpen] = useState({ isShippingAddressOpen: false, isBillingAddressOpen: false });

  const redirectToHome = async () => {
    const cartNumber = await getCartNumber();
    if (!cartNumber && !userDetails) {
      window.location.href = "/";
    }
  };

  const toggleShippingOptionsMessage = (showMessage: boolean) => {
    setIsLoading(false);
    setIsShippingLoader(false);
    setIsShippingOptionsUnavailable(showMessage);
  };

  const handleRegisterUser = () => {
    setIsResetForm(true);
    openModal("checkoutAsGuest");
  };

  const updateShippingOptionsState = (shippingOptionsCount: number, userId: number) => {
    if (!userId) {
      shippingOptionsCount ? toggleShippingOptionsMessage(false) : toggleShippingOptionsMessage(true);
      return;
    }

    const hasAddress = addressInfo?.addressList && addressInfo?.addressList?.length > 0;
    shippingOptionsCount && hasAddress ? toggleShippingOptionsMessage(false) : toggleShippingOptionsMessage(true);
  };

  /** Shipping option Update */
  const updateShippingOptions = async (shippingRequest: IShippingRequest) => {
    setIsShippingLoader(true);
    const userId: number = userDetails?.userId ?? 0;

    let guestUserId = 0;
    let shippingOptions = [] as IShippingOption[];
    const getGuestUserAddressIds = async () => {
      const cartNumber = await getCartNumber();
      const guestUserDetails = await getCheckoutGuestUserDetails(cartNumber ?? "");
      if (guestUserDetails?.guestUserId && guestUserDetails?.billingAddressId && guestUserDetails?.shippingAddressId) {
        guestUserId = guestUserDetails.guestUserId;
        return {
          shippingAddressId: guestUserDetails.shippingAddressId,
          billingAddressId: guestUserDetails.billingAddressId,
        };
      }
      return null;
    };

    const getAddressDetails = async () => {
      if (userId && shippingRequest.shippingAddressId) {
        return {
          shippingAddressId: shippingRequest.shippingAddressId,
          billingAddressId: shippingRequest.billingAddressId,
        };
      }
      return await getGuestUserAddressIds();
    };

    const addressDetails = await getAddressDetails();

    setIsLoading(true);
    if (addressDetails) {
      const { shippingAddressId, billingAddressId } = addressDetails;
      setAddressId(shippingAddressId);
      if (billingAddressId && shippingAddressId) {
        const updateAddressIdsStatus = await updateAddressIds(shippingAddressId, billingAddressId, shippingOptionId);
        if (updateAddressIdsStatus) {
          // setReloadCheckoutOrderSummary(!reloadCheckoutOrderSummary);
          shippingRequest.userId = userId || guestUserId;
          const cardNumber = await getCartNumber();
          shippingRequest.cartNumber = cardNumber;
          setShippingPinCode(shippingRequest.shippingPostalCode ?? "");
          shippingOptions = await getShippingOptions(shippingRequest);
          refreshCartSummary();
        }
      }
    }
    setShippingOptions(shippingOptions);
    updateShippingOptionsState(shippingOptions?.length || 0, userId);
  };

  useEffect(() => {
    if (isUser) getReorderAddressDetails();
    redirectToHome();
    setCheckoutSettings(checkoutPortalData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRegistrationComplete = (value: boolean) => {
    setResetAddress(value);
  };

  return (
    <>
      {isPaymentLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <LoaderComponent isLoading={isLoading} width="70px" height="70px" />
        </div>
      )}
      <div>
        {!isFromQuote ? (
          <Heading name={checkoutTranslations("proceedToCheckout")} dataTestSelector="hdgCheckout" level="h1" showSeparator />
        ) : (
          <Heading name={checkoutTranslations("quoteRequest")} dataTestSelector="hdgQuote" level="h1" showSeparator />
        )}
      </div>
      <div className="flex flex-col justify-center gap-6 mb-4 md:gap-10 lg:flex-row">
        <div className="flex flex-col w-full">
          <div className="lg:hidden">
            <CheckoutSubmitOrderActions
              setIsDisabled={setIsDisabled}
              isDisabled={isDisabled}
              isAddEditAddressOpen={addEditAddressOpen}
              total={orderSummaryData?.total ?? 0}
              voucherAmount={orderSummaryData.giftCardAmount ?? 0}
              isFromQuote={isFromQuote}
              jobName={jobName}
              additionalInstruction={additionalInstruction}
              isApprovalPaymentStatus={isApprovalPaymentStatus}
              orderLimit={orderLimit}
              approvalType={approvalType}
              enableApprovalRouting={enableApprovalRouting}
              isPaymentSelected={isPaymentSelected}
              isOABFlagOn={isOABFlagOn}
              recaptchaDetails={recaptchaDetails}
              isMobileButton={true}
              userDetails={userDetails as IUser}
            />
          </div>
          {!addressLoading && addressInfo ? (
            <AddressWrapper
              addressData={addressInfo}
              updateShippingOptions={updateShippingOptions}
              resetForm={isResetForm}
              resetAddress={resetAddress}
              setIsDisabled={setIsDisabled}
              setAddEditAddressOpen={setAddEditAddressOpen}
              enableShippingAddressSuggestion={enableShippingAddressSuggestion}
              isBillingAddressOptional={isBillingAddressOptional}
              userDetails={userDetails as IUser}
              enableAddressValidation={checkoutPortalData?.enableAddressValidation as boolean}
            />
          ) : (
            <LoaderComponent isLoading={addressLoading} />
          )}

          {!userDetails?.userId ? (
            <div className="flex gap-3 py-5 align-center xs:w-5/6">
              <Link href="/login?routePath=cart" data-test-selector="linkExistingUser" prefetch={false} className="text-sm underline text-textColor hover:text-textColor">
                {addressTranslations("existingUser")}
              </Link>

              <Link
                href="#"
                data-test-selector="linkCreateAccount"
                className="text-sm text-textColor hover:text-textColor underline"
                onClick={(e) => {
                  e.preventDefault();
                  handleRegisterUser();
                }}
              >
                {addressTranslations("createAnAccount")}
              </Link>
            </div>
          ) : null}

          <Heading dataTestSelector="hdgShippingMethod" name={addressTranslations("shippingMethod")} customClass="uppercase" showSeparator level="h2" />

          <div className="mb-3 md:flex sm:justify-between">
            {!isShippingLoader && shippingOptions && shippingOptions.length > 0 ? (
              <ShippingOptions
                shippingOptions={shippingOptions}
                noShippingOptions={isShippingOptionsUnavailable}
                freeShipping={false}
                currencyCode={checkoutSettings && (checkoutSettings.currencyCode || "USD")}
                shippingConstraintCode={shippingConstraintCode}
                inHandDate={inHandDate}
                addressId={addressId}
              />
            ) : null}

            {isShippingLoader ? (
              <div className="flex items-center justify-center md:w-2/5">
                <LoaderComponent width="50px" height="50px" isLoading={isShippingLoader} />
              </div>
            ) : (
              shippingOptions && !shippingOptions.length && <p>{checkoutTranslations("noShippingOptions")}</p>
            )}

            {checkoutSettings?.enableShippingConstraints ? (
              <ShippingConstraint onShippingConstraintChange={setShippingConstraintCode} onInHandDateChange={setInHandDate} generalSetting={generalSetting} />
            ) : null}
          </div>
          {!isFromQuote && paymentOptions && (
            <div>
              <PaymentOptions
                paymentOptions={paymentOptions}
                total={orderSummaryData.total ?? 0}
                voucherAmount={orderSummaryData.giftCardAmount ?? 0}
                jobName={jobName}
                additionalInstruction={additionalInstruction}
                setPaymentProcessing={setIsPaymentProcessing}
                setIsDisabled={setIsDisabled}
                setIsPaymentSelected={setIsPaymentSelected}
                isFromQuote={false}
                currencyCode={checkoutSettings?.currencyCode}
                isOfflinePayment={false}
                isOABFlagOn={setIsOABFlagOn}
                approvalType={approvalType}
                enableApprovalRouting={enableApprovalRouting}
                isApprovalPaymentStatus={setIsApprovalPaymentStatus}
                setIsBillingAddressOptional={setIsBillingAddressOptional}
              />
            </div>
          )}
          <PaymentApplicationLoader isPaymentProcessing={isPaymentProcessing} />
        </div>
        <div className="flex flex-col xs:w-full lg:w-3/6">
          <div className="px-4 py-3 shadow-md mt-[-10px]">
            <div className="hidden lg:block">
              <CheckoutSubmitOrderActions
                setIsDisabled={setIsDisabled}
                isDisabled={isDisabled}
                isAddEditAddressOpen={addEditAddressOpen}
                total={orderSummaryData?.total ?? 0}
                voucherAmount={orderSummaryData.giftCardAmount ?? 0}
                isFromQuote={isFromQuote}
                jobName={jobName}
                additionalInstruction={additionalInstruction}
                isApprovalPaymentStatus={isApprovalPaymentStatus}
                orderLimit={orderLimit}
                approvalType={approvalType}
                enableApprovalRouting={enableApprovalRouting}
                isPaymentSelected={isPaymentSelected}
                isOABFlagOn={isOABFlagOn}
                recaptchaDetails={recaptchaDetails}
                userDetails={userDetails as IUser}
              />
            </div>
            <CartReview isFromQuote={isFromQuote} portalCurrencyCode={checkoutSettings?.currencyCode || "USD"} isShippingLoader={isShippingLoader} />
            {checkoutSettings && checkoutSettings.showPromoSection && !isFromQuote ? <Promo type={DISCOUNT_TYPE.COUPON} shippingPinCode={shippingPinCode} /> : null}
            <AdditionalInformation
              jobName={jobName}
              setJobName={setJobName}
              additionalInstruction={additionalInstruction}
              setAdditionalInstruction={setAdditionalInstruction}
              additionalError={additionalError}
              setAdditionalError={setAdditionalError}
              jobError={jobError}
              setJobError={setJobError}
            />
          </div>
        </div>
      </div>
      <Modal modalId="checkoutAsGuest" size="6xl" maxHeight="xl">
        <div className="w-100">
          <SignupWrapper onRegistrationComplete={onRegistrationComplete} />
        </div>
      </Modal>
    </>
  );
}

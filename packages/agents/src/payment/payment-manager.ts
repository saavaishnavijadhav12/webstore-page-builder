import { AREA, errorStack, logServer } from "@znode/logger/server";
import { IPaymentManagerBankAccountResponse, IPaymentManagerCaptureRequest, IPaymentManagerPurchaseResponse, IPaymentResponse, ITokenResponse } from "@znode/types/payment";
import { mapAuthorizeRequest, mapBankAccountRequest, mapPaymentDetailsRequest, mapPurchaseRequest } from "./mapper";
import { PaymentGateway_authorize, PaymentGateway_capture, PaymentGateway_tokenByCustomerId, PaymentGateway_token, PaymentGateway_bankAccount, PaymentGateway_purchase } from "@znode/clients/payment";
import { ISubmitPaymentModel } from "@znode/types/checkout";
import { IUpdateOrderPayment } from "@znode/types/order";
import { PAYMENT_STATUS, PAYMENT_SUBTYPE, SPREEDLY_RESPONSE_CODE } from "@znode/constants/payment";
import { convertCamelCase } from "@znode/utils/server";

export async function createPayment(submitPaymentModel: ISubmitPaymentModel): Promise<IUpdateOrderPayment> {
  try {
    if (submitPaymentModel.paymentSubTypeCode.toLowerCase() === PAYMENT_SUBTYPE.ACH.toLowerCase()) {
      return createACHPayment(submitPaymentModel);
    } else {
      return createCreditCardPayment(submitPaymentModel);
    }
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return {} as IUpdateOrderPayment;
  }
}

export async function createACHPayment(submitPaymentModel: ISubmitPaymentModel): Promise<IUpdateOrderPayment> {
  let updatePaymentRequest: IUpdateOrderPayment | null;
  try {
    submitPaymentModel.paymentMethodToken = (await createBankAccount(submitPaymentModel.configurationSetCode, submitPaymentModel.paymentDetailsToken)) ?? "";
    if (submitPaymentModel) {
      const purchaseResponse = await createPurchase(submitPaymentModel);
      if (purchaseResponse?.transactionId && Number(purchaseResponse?.transactionId || 0) ) {
        const transactionStatus = purchaseResponse.isSuccess
          ? PAYMENT_STATUS.CAPTURED
          : purchaseResponse.responseCode === SPREEDLY_RESPONSE_CODE.DECLINED
          ? PAYMENT_STATUS.DECLINED
          : PAYMENT_STATUS.FAILED;
        const paymentResponse = { transactionId: purchaseResponse?.transactionId, externalTransactionId: purchaseResponse.externalTransactionId } as IPaymentResponse;
        updatePaymentRequest = await mapPaymentDetailsRequest(paymentResponse, transactionStatus, submitPaymentModel);
        return updatePaymentRequest ?? {} as IUpdateOrderPayment;
      }
    }
    return {} as IUpdateOrderPayment;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return {} as IUpdateOrderPayment;
  }
}

export async function createPurchase(submitPaymentModel: ISubmitPaymentModel) {
  let purchaseResponse: IPaymentManagerPurchaseResponse | null = null;

  const purchaseRequest = await mapPurchaseRequest(submitPaymentModel);
  try {
    if (
      submitPaymentModel?.configurationSetCode &&
      purchaseRequest?.gatewayCurrencyCode &&
      purchaseRequest?.orderId &&
      purchaseRequest?.paymentMethodToken &&
      purchaseRequest?.total
    ) {
      purchaseResponse = convertCamelCase(await PaymentGateway_purchase(submitPaymentModel?.configurationSetCode, purchaseRequest));
    }
    return purchaseResponse;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return purchaseResponse;
  }
}

export async function createBankAccount(configurationSetCode: string, bankDetailsToken: string): Promise<string | null> {
  let paymentMethodToken: string | null = null;
  try {
    if (configurationSetCode) {
      const bankAccountRequest = await mapBankAccountRequest(bankDetailsToken);
      if (bankAccountRequest) {
        const bankAccountResponse: IPaymentManagerBankAccountResponse = convertCamelCase(await PaymentGateway_bankAccount(configurationSetCode, bankAccountRequest));
        paymentMethodToken = bankAccountResponse.gatewayPaymentMethodToken ?? null;
        return paymentMethodToken;
      }
    }
    return paymentMethodToken;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return paymentMethodToken;
  }
}

export async function createCreditCardPayment(submitPaymentModel: ISubmitPaymentModel): Promise<IUpdateOrderPayment> {
  try {
    const authorizeResponse = await authorize(submitPaymentModel);
    if (authorizeResponse.transactionId && Number(authorizeResponse.transactionId || 0)) {
      let updatePaymentRequest: IUpdateOrderPayment | null = null;
      if (submitPaymentModel.isCapture) {
        const captureResponse = await capture(submitPaymentModel.configurationSetCode, { transactionId: authorizeResponse.transactionId } as IPaymentManagerCaptureRequest);

        if (captureResponse.transactionId) {
          updatePaymentRequest = await mapPaymentDetailsRequest(captureResponse, PAYMENT_STATUS.CAPTURED, submitPaymentModel);
        }
      } else {
        updatePaymentRequest = await mapPaymentDetailsRequest(authorizeResponse, PAYMENT_STATUS.AUTHORIZED, submitPaymentModel);
      }
      return updatePaymentRequest ?? {} as IUpdateOrderPayment;
    } else return {} as IUpdateOrderPayment;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return {} as IUpdateOrderPayment;
  }
}

export async function clientToken(configurationSetCode: string, customerGuid: string): Promise<ITokenResponse> {
  try {
    let tokenResponse: ITokenResponse;
    if (customerGuid && customerGuid != "") tokenResponse = convertCamelCase(await PaymentGateway_tokenByCustomerId(configurationSetCode, customerGuid));
    else tokenResponse = convertCamelCase(await PaymentGateway_token(configurationSetCode));
    return tokenResponse;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return {} as ITokenResponse;
  }
}

const authorize = async (submitPaymentModel: ISubmitPaymentModel): Promise<IPaymentResponse> => {
  try {
    let authorizeResponse = {} as IPaymentResponse;
    if (submitPaymentModel) {
      const authorizeRequest = (await mapAuthorizeRequest(submitPaymentModel)) || {};
      authorizeResponse = convertCamelCase(await PaymentGateway_authorize(submitPaymentModel.configurationSetCode, authorizeRequest));
    }
    return authorizeResponse;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return {} as IPaymentResponse;
  }
};

const capture = async (pluginIdentifier: string, requestModel: IPaymentManagerCaptureRequest): Promise<IPaymentResponse> => {
  try {
    const captureResponse: IPaymentResponse = convertCamelCase(await PaymentGateway_capture(pluginIdentifier, requestModel));
    return captureResponse;
  } catch (error) {
    logServer.error(AREA.PAYMENT, errorStack(error));
    return {} as IPaymentResponse;
  }
};

import {ITokenResponse} from "@znode/types/payment";

import { ISubmitPaymentModel } from "@znode/types/checkout";
import { httpRequest } from "../base";
import { objectToQueryString } from "@znode/utils/component";
import { IUpdateOrderPayment } from "@znode/types/order";

export const create = async (paymentRequest: ISubmitPaymentModel): Promise<IUpdateOrderPayment> => {
  const paymentResponse = await httpRequest<IUpdateOrderPayment>({
    endpoint: "/api/payment-manager/create",
    method: "POST",
    body: { paymentRequest },
  });
  return paymentResponse;
};

export const clientToken = async (props: { configurationSetCode: string, customerGuid: string }): Promise<ITokenResponse> => {
  const queryString: string = objectToQueryString(props);
  const tokenResponse = await httpRequest<ITokenResponse>({ 
    endpoint: `/api/payment-manager/gateway-token?${queryString}`
  });
  return tokenResponse;
};
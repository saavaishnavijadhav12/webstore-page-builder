import { AREA, errorStack, logServer } from "@znode/logger/server";
import { convertCamelCase, convertPascalCase, ExpandCollection } from "@znode/utils/server";
import { Calculate_applyDiscount, Calculate_removeDiscountByCartNumber } from "@znode/clients/cp";
import { IApplyDiscountRequest, ICartSummary, IDiscountedDetailsResponseModel, IDiscountRequestModel, IDiscountStatusResponseModel } from "@znode/types/cart";
import { getCartSummaryExpands } from "../cart";
import { mapCalculation } from "../cart/mapper";
import { DiscountedDetailsResponseModel } from "packages/clients/src/types/interface";

export async function removeDiscount(removeDiscountRequestModel: IApplyDiscountRequest) {
  try {
    if (!removeDiscountRequestModel?.cartNumber) {
      return handleDiscountFailure();
    }

    const expands: ExpandCollection = getCartSummaryExpands(removeDiscountRequestModel.isCart ?? false, removeDiscountRequestModel.isShippingOptionSelected ?? false);
    const removedDiscountResponse = await Calculate_removeDiscountByCartNumber(removeDiscountRequestModel.cartNumber, expands, getDiscountRequestModel(removeDiscountRequestModel));
    return processDiscountResponse(removedDiscountResponse);
  } catch (error) {
    logServer.error(AREA.DISCOUNT, errorStack(error));
    return getDiscountFailureModel();
  }
}

export async function applyDiscount(applyDiscountRequest: IApplyDiscountRequest): Promise<IDiscountedDetailsResponseModel> {
  try {
    if (!applyDiscountRequest?.cartNumber) {
      return handleDiscountFailure();
    }

    const expands: ExpandCollection = getCartSummaryExpands(applyDiscountRequest.isCart ?? false, applyDiscountRequest.isShippingOptionSelected ?? false);
    const response = await Calculate_applyDiscount(applyDiscountRequest.cartNumber, expands, getDiscountRequestModel(applyDiscountRequest));
    return processDiscountResponse(response);
  } catch (error) {
    logServer.error(AREA.DISCOUNT, errorStack(error));
    return getDiscountFailureModel();
  }
}

function getDiscountRequestModel(applyDiscountRequest: IApplyDiscountRequest) {
  const discountRequestModel: IDiscountRequestModel = {
    discountType: applyDiscountRequest.discountType,
    discountCode: applyDiscountRequest.discountCode,
    amount: 0,
  };
  return convertPascalCase(discountRequestModel);
}

function processDiscountResponse(discountedDetails: DiscountedDetailsResponseModel): IDiscountedDetailsResponseModel {
  const formattedResponse = convertCamelCase(discountedDetails);

  if (formattedResponse?.discountStatus && formattedResponse.calculatedDetails) {
    const { costFactorResponse: costs, discountFactorResponse: discounts, cartId, subTotal, total } = formattedResponse.calculatedDetails;

    const cartSummary: ICartSummary = {
      cartId: cartId,
      costs: costs,
      discounts: discounts,
      subTotal: subTotal,
      total: total,
    };

    return {
      discountStatus: formattedResponse.discountStatus,
      calculatedDetails: mapCalculation(cartSummary),
    };
  }
  return handleDiscountFailure();
}

function handleDiscountFailure(): IDiscountedDetailsResponseModel {
  logServer.error(AREA.DISCOUNT, "Failed to apply/remove discount.");
  return getDiscountFailureModel();
}

function getDiscountFailureModel(): IDiscountedDetailsResponseModel {
  const discountStatusResponseModel: IDiscountStatusResponseModel = {
    isSuccess: false,
  };
  return { discountStatus: discountStatusResponseModel } as IDiscountedDetailsResponseModel;
}

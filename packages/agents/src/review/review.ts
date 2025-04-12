import { AREA, errorStack, logServer } from "@znode/logger/server";

import { CustomersReviews_customersReviews } from "@znode/clients/v2";
import { IProductReviewRequest } from "@znode/types/review";
import { convertPascalCase } from "@znode/utils/server";

export async function writeReview(reviewModel: IProductReviewRequest): Promise<string | null> {
  try {
    const productReviewData = convertPascalCase(reviewModel);
    const reviewDetail = await CustomersReviews_customersReviews(productReviewData);
    return reviewDetail?.Status || null;
  } catch (error) {
    logServer.error(AREA.PRODUCT, errorStack(error));
    return null;
  }
}

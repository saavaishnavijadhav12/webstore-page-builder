import { QUOTE_STATUS } from "@znode/constants/quote";
import { IQuoteModel } from "@znode/types/quote";

//Check if the Quote is Valid For Convert To an Order
export function isQuoteValidForConvertToOrder(quoteModel: IQuoteModel): boolean {
  const expirationDate = quoteModel?.expirationDate ? new Date(quoteModel.expirationDate) : null;
  const today = new Date();

  const invalidStatuses = [QUOTE_STATUS.QUOTE_STATUS_APPROVED, QUOTE_STATUS.QUOTE_STATUS_SUBMIT, QUOTE_STATUS.QUOTE_STATUS_EXPIRED, QUOTE_STATUS.QUOTE_STATUS_CANCELED];

  const isInvalidStatus = invalidStatuses.includes(quoteModel?.classStateName || "");
  const isExpiredToday = expirationDate && expirationDate.toDateString() === today.toDateString();

  return !(isExpiredToday || isInvalidStatus);
}

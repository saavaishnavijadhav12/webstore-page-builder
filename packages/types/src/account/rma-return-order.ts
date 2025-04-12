export interface IRMAReturnList {
  returnList: IRMAReturn[];
  totalResults: number;
}

export interface IRMAReturn {
  returnNumber: string;
  returnDate: Date;
  returnStatus: string;
  totalExpectedReturnQuantity: number;
}

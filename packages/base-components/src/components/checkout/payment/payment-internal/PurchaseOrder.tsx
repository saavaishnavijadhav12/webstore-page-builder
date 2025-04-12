import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import Button from "../../../common/button/Button";
import { FILE_FORMATS } from "@znode/constants/payment";
import { IPaymentConfigurationSetDetails } from "@znode/types/payment";
import Input from "../../../common/input/Input";
import { ValidationMessage } from "../../../common/validation-message";
import { errorStack } from "@znode/logger/server";
import { logClient } from "@znode/logger";
import { uploadPOMedia } from "../../../../http-request";
import { usePayment } from "../../../../stores";
import { useTranslations } from "next-intl";

const PurchaseOrder = ({
  poDocEnabled,
  poDocRequired,
  setIsDisabled,
  setIsDisabledConvertQuote,
}: {
  configurationSet: IPaymentConfigurationSetDetails;
  poDocEnabled?: boolean;
  poDocRequired?: boolean;
  setIsDisabled?: Dispatch<SetStateAction<boolean>>;
  setIsDisabledConvertQuote?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState<string | null>(null);
  const [purchaseOrderDocumentPath, setPurchaseOrderDocumentPath] = useState<string | null>(null);
  const [purchaseOrderError, setPurchaseOrderError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileNameError, setFileNameError] = useState<string | null>(null);
  const paymentTranslations = useTranslations("Payment");
  const commonTranslations = useTranslations("Common");
  const { setPurchaseOrderDetails } = usePayment();
  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const isValidFileName = validateFileName(file.name);
        if (isValidFileName) {
          setIsDisabled && setIsDisabled(true);
          setIsDisabledConvertQuote && setIsDisabledConvertQuote(true);
          let purchaseOrderDocumentFilePath;
          const formData = new FormData();
          formData.append("file", file);
          await uploadPOMedia(formData).then((mediaResponse) => (purchaseOrderDocumentFilePath = mediaResponse.data));
          if (purchaseOrderDocumentFilePath !== undefined) {
            setFileName(file.name);
            setFileNameError("");

            setPurchaseOrderDocumentPath(purchaseOrderDocumentFilePath);
            setPurchaseOrderDetails(purchaseOrderNumber, purchaseOrderDocumentFilePath);
            setIsDisabled && setIsDisabled(purchaseOrderNumber === "");
            setIsDisabledConvertQuote && setIsDisabledConvertQuote(purchaseOrderNumber === "");
          }
        } else {
          setFileName("");
          setFileNameError(paymentTranslations("purchaseOrderInvalidFileError"));
          setIsDisabled && setIsDisabled(true);
          setIsDisabledConvertQuote && setIsDisabledConvertQuote(true);
        }
      } else {
        setFileName("");
        setFileNameError(paymentTranslations("purchaseOrderFileError"));
        setIsDisabled && setIsDisabled(poDocRequired ?? false);
        setIsDisabledConvertQuote && setIsDisabledConvertQuote(poDocRequired ?? false);
      }
    } catch (error) {
      logClient.error("Error in method - handleFileInput " + errorStack(error));
    }
  };

  const validateFileName = (fileName: string): boolean => {
    if (poDocRequired) {
      if (fileName.trim() === "") return false;
    }
    const format = fileName.split(".").pop();
    if (format && FILE_FORMATS.includes(format)) return true;
    return false;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const purchaseOrderNumberVal = event.target.value;
    setPurchaseOrderNumber(purchaseOrderNumberVal);
    setPurchaseOrderDetails(purchaseOrderNumberVal, purchaseOrderDocumentPath);

    if (purchaseOrderNumberVal.trim() !== "") {
      setPurchaseOrderError("");

      if (poDocRequired) {
        setIsDisabled && setIsDisabled(fileName === "");
        setIsDisabledConvertQuote && setIsDisabledConvertQuote(fileName === "");
      } else {
        setIsDisabled && setIsDisabled(false);
        setIsDisabledConvertQuote && setIsDisabledConvertQuote(false);
      }
    } else {
      setPurchaseOrderNumber("");
      setPurchaseOrderError(paymentTranslations("purchaseOrderNumber"));
      setIsDisabled && setIsDisabled(true);
      setIsDisabledConvertQuote && setIsDisabledConvertQuote(true);
    }
  };

  return (
    <div>
      <div className="mt-6">
        <Input
          labelDataTestSelector="lblPurchaseOrderNumber"
          type="text"
          id="voucher-number"
          className="px-2 py-1 h-10 w-full min-[992px]:w-2/5"
          value={purchaseOrderNumber ?? ""}
          onChange={handleInputChange}
          isLabelShow={true}
          label={paymentTranslations("purchaseOrder")}
          isRequired={true}
          labelCustomClass="font-semibold text-sm"
          dataTestSelector="txtPurchaseOrderNumber"
        />
        {purchaseOrderError && <ValidationMessage message={purchaseOrderError} dataTestSelector="purchaseOrderNumberError" customClass="mt-2 " />}
      </div>
      {poDocEnabled && (
        <div className="mt-3">
          <div className="pb-2" data-test-selector="divPurchaseOrder">
            <label className="text-sm font-semibold" htmlFor="file" data-test-selector="lblPurchaseOrder">
              {paymentTranslations("purchaseOrderDocumentation")}
            </label>
            {poDocRequired && <span className="text-errorColor"> *</span>}
          </div>
          <div>
            <Button type="primary" size="small" dataTestSelector="btnBrowse" ariaLabel="browse purchase order button" className="w-32">
              {commonTranslations("browse")}
            </Button>
            <input className="relative w-32 h-10 opacity-0 right-32" type="file" onChange={handleFileInput} />
            {fileNameError && <ValidationMessage message={fileNameError} dataTestSelector="fileNameError" customClass="text-sm text-errorColor" />}
            <p className="text-sm font-medium">{fileName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;

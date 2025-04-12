"use client";
import { PropsWithChildren } from "react";
import { useModal } from "../../../stores/modal";

interface IModalProps extends PropsWithChildren {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  maxHeight?: "sm" | "lg" | "xl";
  customClass?: string;
  noDefaultClass?: string;
  modalId: string;
  isMaskedModal?: boolean;
  maskedCloseModal?: () => void;
  maskedModalActivatedId?: string;
}
export function Modal(props: Readonly<IModalProps>) {
  const { modalActiveId, closeModal, inventoryId, isInventory } = useModal();

  const { size = "md", maxHeight, customClass, children, modalId, noDefaultClass, isMaskedModal = false, maskedModalActivatedId, maskedCloseModal } = props || {};

  const getSizeClass = (): string => {
    const sizeClasses: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    };
    return sizeClasses[size] || "max-w-md";
  };

  const getHeightStyle = (): string => {
    const heightMap: Record<string, string> = {
      sm: "25%",
      lg: "75%",
      xl: "100%",
    };
    return heightMap[maxHeight || "xl"];
  };

  const handleCloseModal = () => (isMaskedModal ? maskedCloseModal : closeModal)?.();

  const isModalActive = modalActiveId === modalId || (isMaskedModal && maskedModalActivatedId) || (modalId === "InventoryDetails" && isInventory && modalId === inventoryId);

  if (!isModalActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full" id={modalId}>
      <div className="fixed inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} onClick={handleCloseModal}></div>

      <div
        className={`bg-white z-50 relative custom-scroll xs:m-4 md:m-1 rounded-cardBorderRadius shadow-md ${getSizeClass()} ${customClass}`}
        style={{ maxHeight: isInventory ? "75%" : getHeightStyle() }}
      >
        {modalActiveId !== "checkoutAsGuest" && modalActiveId !== "ImpersonationInfoModel" && (
          <button className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-600" onClick={handleCloseModal} data-test-selector={`btnCancel${modalId}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M14.348 5.652a.5.5 0 0 1 .708.708L10.707 10l4.349 4.348a.5.5 0 0 1-.708.708L10 10.707l-4.348 4.349a.5.5 0 0 1-.708-.708L9.293 10 4.944 5.652a.5.5 0 0 1 .708-.708L10 9.293l4.348-4.349z"
              />
            </svg>
          </button>
        )}
        <div className={noDefaultClass || "px-4 py-3"}>{children}</div>
      </div>
    </div>
  );
}

"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Popup } from "../popup/Popup";

interface IPopupButtonProps {
  buttonTitle: string;
  popupHeaderTitle: string;
  children: ReactNode;
  onSave: () => void;
  onBack: () => void;
  onOpen: (type?: "window" | "change", text?: string) => void;
}

export function PopupButton(props: IPopupButtonProps) {
  const { buttonTitle, popupHeaderTitle, children, onSave, onBack, onOpen } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const eventData = event.data;
      if (!eventData || eventData?.actionType !== "open_popup") return;

      const text = eventData?.data?.text || "";
      setShow(true);
      onOpen("window", text);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleTogglePopUp() {
    setShow((e) => !e);
  }

  function handleButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (e.detail === 0) return; // click ignored because it was triggered by Enter key

    e.preventDefault();
    handleTogglePopUp();
    onOpen();
  }

  function handleSave() {
    handleTogglePopUp();
    onSave();
  }

  function handleClose() {
    handleTogglePopUp();
    onBack();
  }

  function renderFooter() {
    return (
      <>
        <button className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition mr-4" onClick={handleClose}>
          Back
        </button>
        <button className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition" onClick={handleSave}>
          Apply Edits
        </button>
      </>
    );
  }

  return (
    <>
      <button onClick={handleButton} className="flex gap-2 justify-center items-center text-[#0158ad] w-full font-[500] rounded-sm py-2 px-4 border hover:bg-blue-200 transition">
        {buttonTitle}
      </button>
      {show && (
        <Popup headerTitle={popupHeaderTitle} closePopup={handleClose} footerElement={renderFooter()}>
          {children}
        </Popup>
      )}
    </>
  );
}

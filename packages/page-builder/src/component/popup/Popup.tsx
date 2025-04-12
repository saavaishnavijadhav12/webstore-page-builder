"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import { ZIcons } from "@znode/base-components/common/icons";

interface IPopupProps {
  headerTitle: string;
  children: ReactNode;
  closePopup: () => void;
  footerElement?: ReactNode;
}

export function Popup(props: Readonly<IPopupProps>) {
  const { children, headerTitle, closePopup, footerElement } = props;

  let footer = footerElement;
  if (!footer) {
    footer = (
      <button className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition" onClick={closePopup}>
        Close
      </button>
    );
  }

  return (
    <DomPortal>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center rounded-sm" style={{ zIndex: 1000, top: "50px" }}>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-lg font-semibold text-gray-800">{headerTitle}</h1>
            <button onClick={closePopup} data-test-selector="btnModalClose">
              <ZIcons name="circle-x" color="#5a5a5a" data-test-selector="svgModalClose" />
            </button>
          </div>

          <div className="p-4">
            <div>{children}</div>
          </div>

          <div className="px-4 pb-4 flex justify-end">{footer}</div>
        </div>
      </div>
    </DomPortal>
  );
}

interface IDomPortalProps {
  children: React.ReactNode;
}
export function DomPortal(props: IDomPortalProps) {
  const ref = useRef<Element | null>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector("#modal");
    setMounted(true);
  }, []);

  return mounted && ref.current ? createPortal(props.children, ref.current) : null;
}

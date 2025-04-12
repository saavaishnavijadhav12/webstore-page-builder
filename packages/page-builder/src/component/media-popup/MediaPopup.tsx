"use client";

import React, { useState } from "react";

import { ZIcons } from "@znode/base-components/common/icons";

interface IMediaPopupProps {
  onChange: (_value: string) => void;
  mediaType: string;
  header: string;
  Component: React.ComponentType<{ mediaType: string; onChangeImage: (_value: string) => void }>;
  ButtonIcon?: React.ComponentType<any>;
}

export function MediaPopup(props: IMediaPopupProps) {
  const { ButtonIcon } = props;
  const [show, setShow] = useState(false);

  const handleClose = (selectedImage: string) => {
    props.onChange(selectedImage);
    setShow(false);
  };

  const handleClosePopUp = () => {
    setShow(false);
  };
  const handleTogglePopUp = () => {
    setShow((e) => !e);
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.detail === 0) return; // click ignored because it was triggered by Enter key

    e.preventDefault();
    handleTogglePopUp();
  };

  const renderPopup = () => {
    const { Component, mediaType, header } = props;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center" style={{ zIndex: 1000 }}>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-lg font-semibold text-gray-800">{header}</h1>
            <button onClick={handleClosePopUp} data-test-selector="btnModalClose">
              <ZIcons name="circle-x" color="#5a5a5a" data-test-selector="svgModalClose" />
            </button>
          </div>

          <div className="p-4">
            <div className="overflow-y-hidden max-h-[50vh]">
              {" "}
              {/* Set a smaller height */}
              {/* Render the passed component dynamically */}
              <Component mediaType={mediaType} onChangeImage={handleClose} />
            </div>
          </div>

          <div className="p-4 py-2 flex justify-end">
            <button className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition" onClick={handleClosePopUp}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button onClick={handleButton} className="flex gap-2 justify-center items-center text-[#0158ad] w-full font-[500] rounded-sm py-2 px-4 border hover:bg-blue-200 transition">
        {ButtonIcon && <ButtonIcon color="#0158ad" size={16} />} {props.header}
      </button>
      {show && renderPopup()}
    </>
  );
}

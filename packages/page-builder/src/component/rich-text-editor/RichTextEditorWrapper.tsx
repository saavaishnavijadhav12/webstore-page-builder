"use client";
import { useState } from "react";
import { PopupButton } from "../popup-button/PopupButton";
import RichTextEditor from "./RichTextEditor";

interface IRichTextEditorWrapperProps {
  value: string;
  onChange: (_value: string) => void;
}

export function RichTextEditorWrapper(props: Readonly<IRichTextEditorWrapperProps>) {
  const { value, onChange } = props;
  const [editorText, setEditorText] = useState(value);

  function handleApply() {
    onChange(editorText);
  }

  function handleBack() {
    setEditorText("");
  }

  function handlePopupOpen(type?: "window" | "change", text?: string) {
    let newValue = value;
    if (type && type === "window") {
      newValue = text || "";
    }

    setEditorText(newValue);
  }

  return (
    <PopupButton buttonTitle="Open Rich Text Widget" popupHeaderTitle="RICH TEXT WIDGET" onOpen={handlePopupOpen} onBack={handleBack} onSave={handleApply}>
      <RichTextEditor editorText={editorText} onEditorTextChange={setEditorText} />
    </PopupButton>
  );
}

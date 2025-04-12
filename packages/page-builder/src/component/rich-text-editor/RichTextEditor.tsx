"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "./rich-text-editor.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export type RichTextEditorHandle = {
  getContent: () => string;
};

interface IRichTextEditorProps {
  editorText: string;
  onEditorTextChange: (_value: string) => void;
}

export function RichTextEditor(props: Readonly<IRichTextEditorProps>) {
  const { editorText, onEditorTextChange } = props;

  function handleOnChange(value: string) {
    onEditorTextChange(value);
  }

  return (
    <ReactQuill
      theme="snow"
      value={editorText}
      onChange={handleOnChange}
      style={{
        height: "220px",
      }}
      modules={{
        toolbar: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ align: [false, "center", "right", "justify"] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
      }}
      placeholder="Write something..."
    />
  );
}
export default RichTextEditor;

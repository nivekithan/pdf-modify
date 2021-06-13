import { Document } from "react-pdf";
import React from "react";

type PdfDocumentProps = {
  url: string;
  children: React.ReactNode;

  // Undo options
  onUndo: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableUndo: boolean;

  // Redo options
  onRedo: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableRedo: boolean;
};

export const PdfDocument = ({
  url,
  children,
  onUndo,
  disableUndo,
  onRedo,
  disableRedo,
}: PdfDocumentProps) => {
  return (
    <Document file={url} className="flex flex-col gap-y-3">
      <div className="flex gap-x-10">
        <button
          className={`bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-700 ${
            disableUndo ? "opacity-50" : ""
          }`}
          onClick={onUndo}
          disabled={disableUndo}
        >
          Undo
        </button>
        <button
          className={`bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-800 ${
            disableRedo ? "opacity-50" : ""
          }`}
          onClick={onRedo}
        >
          Redo
        </button>
      </div>
      <div>{children}</div>
    </Document>
  );
};
